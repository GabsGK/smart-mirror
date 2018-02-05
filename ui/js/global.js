
/*
 * Copyright © 2018. All rights reserved.
 *
*/

/* The Global module is used to initialize the other modules */

/* global TooltipDialogs: true, Conversation: true, ConversationResponse: true, Sidebar: true, Animations: true, Common: true */


(function() {
  Conversation.init();
  ConversationResponse.init();
  ImageModule.startup();
  document.body.style.visibility = 'visible';
}());
