<?php

defined('ABSPATH') or die("Bye bye");

function rl_events_update_custom_roles() {
    if ( get_option( 'organizer_role_version' ) < 2 ) {
        add_role( 'organizer_role', 'Event Organizer', array( 
			'read_game_data' => true,
			'read' => true,
			'read_private_events' => true,			
			'read_private_locations' => true
		) );
        update_option( 'organizer_role_version', 2 );
    }
}
add_action( 'init', 'rl_events_update_custom_roles' );