import TokenRingApp from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {TokenRingPlugin} from "@tokenring-ai/app";

import packageJSON from "./package.json" with {type: "json"};
import ThinkingService from "./ThinkingService.ts";
import tools from "./tools.ts";


export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app: TokenRingApp) {
    app.waitForService(ChatService, chatService => {
      chatService.addTools(packageJSON.name, tools);
    });
    app.addServices(new ThinkingService());
  },
} satisfies TokenRingPlugin;
