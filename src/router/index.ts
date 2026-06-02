import { createRouter, createWebHistory } from "vue-router";
import PlayerView from "../views/PlayerView.vue";
import ConsoleView from "../views/ConsoleView.vue";
import BrowseView from "../views/BrowseView.vue";
import SettingsView from "../views/SettingsView.vue";

const routes = [
  { path: "/", redirect: "/browse" },
  { 
    path: "/player", 
    component: PlayerView,
    meta: { hideSidebar: true } 
  },
  { path: "/console", component: ConsoleView },
  { path: "/browse", component: BrowseView },
  { path: "/settings", component: SettingsView, meta: { hideSidebar: true } },
  // Placeholders for other routes
  { path: "/playlists", component: BrowseView },
  { path: "/artists", component: BrowseView },
  { path: "/albums", component: BrowseView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
