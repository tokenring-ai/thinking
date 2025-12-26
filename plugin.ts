import {TokenRingPlugin} from "@tokenring-ai/app";
import {ChatService} from "@tokenring-ai/chat";
import {z} from "zod";

import packageJSON from "./package.json" with {type: "json"};
import ThinkingService from "./ThinkingService.ts";
import tools from "./tools.ts";

const packageConfigSchema = z.object({});


export default {
  name: packageJSON.name,
  version: packageJSON.version,
  description: packageJSON.description,
  install(app, config) {
    app.waitForService(ChatService, chatService => {
      chatService.addTools(packageJSON.name, tools);
    });
    app.addServices(new ThinkingService());
  },
  config: packageConfigSchema
} satisfies TokenRingPlugin<typeof packageConfigSchema>;
