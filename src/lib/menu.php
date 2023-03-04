<?php

defined('ABSPATH') or die("Bye bye");

// Top level menu del plugin
function rl_events_menu_administrador() {
  add_menu_page(RL_EVENTS_NAME, RL_EVENTS_NAME, 'read_game_data', RL_EVENTS_PATH.'/src/game_data/index.php');
  // add_submenu_page(RL_EVENTS_PATH.'/src/game_data/index.php', 'Dar de alta un evento', 'Dar de alta un evento', 'manage_options', RL_EVENTS_PATH.'/src/admin/new_event/form.php');
  // add_submenu_page(RL_EVENTS_PATH.'/src/game_data/index.php', 'Lista eventos próximo mes', 'Lista eventos próximo mes', 'manage_options', RL_EVENTS_PATH.'/src/admin/event_list/form.php');
}

add_action( 'admin_menu', 'rl_events_menu_administrador' );
