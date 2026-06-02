export class DualAudioEngine {
  private activePlayer: HTMLAudioElement;
  private standbyPlayer: HTMLAudioElement;
  public crossfadeDuration = 6000; // 6 seconds crossfade
  private fadeSteps = 30; // Steps for the volume transition
  private volumeTarget = 1.0; // Global volume

  public onTimeUpdate: (time: number, duration: number) => void = () => {};
  public onEnded: () => void = () => {};
  public onNextNeeded: () => void = () => {}; // Fired when we enter crossfade zone

  private isCrossfading = false;
  private nextTriggered = false;
  private currentFadeInterval: any = null;

  private sinkIds: string[] = ['default'];
  private slaveActivePlayers: HTMLAudioElement[] = [];
  private slaveStandbyPlayers: HTMLAudioElement[] = [];

  constructor() {
    this.activePlayer = new Audio();
    this.standbyPlayer = new Audio();

    const timeUpdateHandler = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      if (target === this.activePlayer) {
        this.onTimeUpdate(target.currentTime, target.duration || 0);

        // Check if we need to trigger next track for crossfading
        const crossfadeSec = this.crossfadeDuration / 1000;
        if (!this.nextTriggered && target.duration > crossfadeSec && target.currentTime >= target.duration - crossfadeSec) {
          this.nextTriggered = true;
          this.onNextNeeded();
        }
        
        // Sync slaves roughly
        this.slaveActivePlayers.forEach(slave => {
          if (Math.abs(slave.currentTime - target.currentTime) > 0.5) {
            slave.currentTime = target.currentTime;
          }
        });
      }
    };

    const endedHandler = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      if (target === this.activePlayer && !this.isCrossfading) {
        this.onEnded();
      }
    };

    this.activePlayer.addEventListener('timeupdate', timeUpdateHandler);
    this.standbyPlayer.addEventListener('timeupdate', timeUpdateHandler);
    this.activePlayer.addEventListener('ended', endedHandler);
    this.standbyPlayer.addEventListener('ended', endedHandler);
  }

  public setSinkIds(ids: string[]) {
    this.sinkIds = ids && ids.length ? ids : ['default'];
    this.applySinkIds();
  }

  private applySinkIds() {
    const mainSink = this.sinkIds[0] === 'default' ? '' : this.sinkIds[0];
    
    if ('setSinkId' in this.activePlayer) {
      (this.activePlayer as any).setSinkId(mainSink).catch((e:any) => console.log('setSinkId error:', e));
      (this.standbyPlayer as any).setSinkId(mainSink).catch((e:any) => console.log('setSinkId error:', e));
    }

    // Clean up old slaves
    this.slaveActivePlayers.forEach(p => { p.pause(); p.src = ''; });
    this.slaveStandbyPlayers.forEach(p => { p.pause(); p.src = ''; });
    this.slaveActivePlayers = [];
    this.slaveStandbyPlayers = [];

    for (let i = 1; i < this.sinkIds.length; i++) {
      const sinkId = this.sinkIds[i];
      
      const cloneActive = new Audio(this.activePlayer.src);
      cloneActive.currentTime = this.activePlayer.currentTime;
      cloneActive.volume = this.activePlayer.volume;
      if ('setSinkId' in cloneActive) {
         (cloneActive as any).setSinkId(sinkId).catch((e:any) => console.log('setSinkId error:', e));
      }
      if (!this.activePlayer.paused) cloneActive.play().catch(e => console.log(e));
      this.slaveActivePlayers.push(cloneActive);

      const cloneStandby = new Audio(this.standbyPlayer.src);
      cloneStandby.volume = this.standbyPlayer.volume;
      if ('setSinkId' in cloneStandby) {
         (cloneStandby as any).setSinkId(sinkId).catch((e:any) => console.log('setSinkId error:', e));
      }
      this.slaveStandbyPlayers.push(cloneStandby);
    }
  }

  public setGlobalVolume(vol: number) {
    this.volumeTarget = Math.max(0, Math.min(1, vol));
    if (!this.isCrossfading) {
      this.activePlayer.volume = this.volumeTarget;
      this.slaveActivePlayers.forEach(p => p.volume = this.volumeTarget);
    }
  }

  public async play(url: string, crossfade: boolean = true) {
    this.nextTriggered = false;
    
    // Load into standby
    this.standbyPlayer.src = url;
    this.standbyPlayer.volume = crossfade ? 0 : this.volumeTarget;
    
    this.slaveStandbyPlayers.forEach(p => {
      p.src = url;
      p.volume = crossfade ? 0 : this.volumeTarget;
    });
    
    try {
      await this.standbyPlayer.play();
      this.slaveStandbyPlayers.forEach(p => p.play().catch(e=>console.log(e)));
    } catch (e) {
      console.error('Playback failed', e);
      this.onEnded(); // Skip to next if failed (e.g. VIP)
      return;
    }

    if (crossfade && !this.activePlayer.paused && this.activePlayer.src) {
      this.doCrossfade();
    } else {
      // Hard stop old player
      this.activePlayer.pause();
      this.slaveActivePlayers.forEach(p => p.pause());
      this.swapPlayers();
    }
  }

  public pause() {
    this.activePlayer.pause();
    this.slaveActivePlayers.forEach(p => p.pause());
  }

  public resume() {
    this.activePlayer.play();
    this.slaveActivePlayers.forEach(p => p.play().catch(e=>console.log(e)));
  }

  public seek(time: number) {
    this.activePlayer.currentTime = time;
    this.slaveActivePlayers.forEach(p => p.currentTime = time);
    this.nextTriggered = false;
  }

  public destroy() {
    this.activePlayer.pause();
    this.standbyPlayer.pause();
    this.slaveActivePlayers.forEach(p => p.pause());
    this.slaveStandbyPlayers.forEach(p => p.pause());
    
    this.activePlayer.src = '';
    this.standbyPlayer.src = '';
    this.clearCrossfade();
  }

  private clearCrossfade() {
    if (this.currentFadeInterval !== null) {
      clearInterval(this.currentFadeInterval);
      this.currentFadeInterval = null;
    }
    this.isCrossfading = false;
  }

  private doCrossfade() {
    this.clearCrossfade();
    this.isCrossfading = true;
    const fadeOutPlayer = this.activePlayer;
    const fadeInPlayer = this.standbyPlayer;
    const fadeOutSlaves = this.slaveActivePlayers;
    const fadeInSlaves = this.slaveStandbyPlayers;
    
    let step = 0;
    const stepTime = this.crossfadeDuration / this.fadeSteps;
    const targetV = this.volumeTarget;

    this.currentFadeInterval = setInterval(() => {
      step++;
      const progress = step / this.fadeSteps;
      
      const outVol = Math.max(0, targetV * (1 - progress));
      const inVol = Math.min(targetV, targetV * progress);
      
      fadeOutPlayer.volume = outVol;
      fadeInPlayer.volume = inVol;
      fadeOutSlaves.forEach(p => p.volume = outVol);
      fadeInSlaves.forEach(p => p.volume = inVol);

      if (step >= this.fadeSteps) {
        this.clearCrossfade();
        fadeOutPlayer.pause();
        fadeOutPlayer.src = ''; // Release memory
        fadeOutSlaves.forEach(p => { p.pause(); p.src = ''; });
        this.swapPlayers(); // Make the faded-in player the active one
      }
    }, stepTime) as any;
  }

  private swapPlayers() {
    const temp = this.activePlayer;
    this.activePlayer = this.standbyPlayer;
    this.standbyPlayer = temp;
    
    const tempSlaves = this.slaveActivePlayers;
    this.slaveActivePlayers = this.slaveStandbyPlayers;
    this.slaveStandbyPlayers = tempSlaves;
  }
}
