<?php

defined('ABSPATH') or die( "Bye bye" );

//Comprueba que tienes permisos para acceder a esta pagina
if (!rl_events_can_access_game_data()) wp_die (__ ('No tienes suficientes permisos para acceder a esta página.'));

$getMonthYearsObject = new RLEvents_GameDataMonthYears(new RLEvents_DB());
$getMonthYear = isset($_GET['month_year']) ? $_GET['month_year'] : $getMonthYearsObject->first();
$getMonthDatesObject = new RLEvents_GameDataMonthDates($getMonthYear);
$getFirstDay = $getMonthDatesObject->firstDay();
$getLastDay = $getMonthDatesObject->lastDay();
$getGamesObject = new RLEvents_GameDataGames(new RLEvents_DB(), $getFirstDay, $getLastDay);
$data = array(
  'members' => Array(),
  'first_day' => $getFirstDay,
  'last_day' => $getLastDay,
  'month_years' => $getMonthYearsObject->data(),
  'games' => $getGamesObject->games(),
  'stats' => $getGamesObject->stats(),
);

?>

<div class="wrap">
  <h2><?php _e( 'Resistencia Lúdica - Game Data', 'rl_events_game_dara' ) ?></h2>
</div>
<section id="game_data" class="game-data js__game-data">
  <div class="game-data__main js__game-data-main"></div>
  <aside class="game-data__default-nav game-data__default-nav--hidden js__game-data-default-nav" aria-hidden="true">
    <ul class="game-data__default-nav-items js_game-data-default-nav-items">
      <?php
        foreach ($data['month_years'] as $monthYear) {
          echo('<li class="game-data__default-nav-item">');
          echo('<a class="game-data__default-nav-link js__game-data-default-nav-link" href="/wp-admin/admin.php?page=rl_events%2Fsrc%2Fgame_data%2Findex.php&month_year='.$monthYear.'">'.$monthYear.'</a><br />');
          echo('</li>');
        }
      ?>
    </ul>
  </aside>
</section>

<script type="text/javascript">
var game_data = <?php echo(json_encode($data, JSON_PRETTY_PRINT)); ?>;
console.log("This are the contents of the 'game_data' JS variable:", game_data);
</script>

