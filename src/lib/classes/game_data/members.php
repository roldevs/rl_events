<?php

defined('ABSPATH') or die( "Bye bye" );

class RLEvents_GameDataMembers {
  public function memberName($discordId) {
    foreach($this->data() as $key => $memberIds) {
      if ($this->filterMemberIds($memberIds, $discordId)) {
        return $key;
      }
    }
    return null;
  }

  public function isMember($discordId) {
    foreach($this->data() as $key => $memberIds) {
      if ($this->filterMemberIds($memberIds, $discordId)) {
        return true;
      }
    }
    return false;
  }

  // Protected

  protected function filterMemberIds($memberIds, $discordId) {
    return array_values(array_filter($memberIds, function($memberId) use($discordId) {
      return $this->cleanName($memberId) === $this->cleanName($discordId);
    }));
  }

  protected function data() {
    return array(
      'Álvaro' => ['4lv#1517', 'alvarokirmizi', '4lv@1517', 'Álvaro PR', 'Alvaro PR'],
      'Ahroun' => ['ahroun79#9335', 'ahroun79'],
      'Alan' => ['rash#7342', 'Alan Tapscott'],
      'Alantar' => ['Alantar#9989', 'alantar'],
      'Alice in Villagato' => ['Alice in VillaGato#8599', 'aliciadevillagato', 'Alicia de VillaGato', "Alice's in VillaGato#8599", "Alice in VillaGato #8599"],
      'Ashe' => ['ashe_merigg#1330', 'ashexss', 'AsheMeri#1330', 'Ashetto_#1330'],
      'Batulíncolorado' => ['batulincolorado#8377', 'batulincolorado'],
      'Bb' => ['bb.#0537', 'bb.0537', 'Bb'],
      'Bernie' => ['bernie#8451', 'bernabox'],
      'Blenda' => ['blenda ek#3412'],
      'Carles F.' => ['carles#5059', 'carles5059', 'Carles Ferrés', 'Carles·5059', 'Carles F. (Carles#5059)', 'Carles F. (Discord: Carles#5059)'],
      'Di0pter' => ['di0pter#1507', 'di0pter', 'Di0pter#1507 ( Guillem )'],
      'Divad' => ['divad#3865', 'dlnonell', 'dlnonell#3865'],
      'DLF' => ['dlf#6807', 'tomaswillquill', 'dlf', 'DLF#6087', 'Dani Ligorio'],
      'Dr. Albán' => ['doctoralban#2753'],
      'Edu Sánchez' => ['Edu Sanchez#1145', 'edusanchez'],
      'Fa de A' => ['fa de a#3760'],
      'Roberto' => ['floyd303#2646', 'rmoliva', 'floyd303', 'Roberto'],
      'Fran Tirado' => ['frantirado#4085', 'frantirado'],
      'Carlos Z' => ['gaztakin#0109', 'gaztakin'],
      'Joan' => ['gorre#1113', '_gorre'],
      'Héctor' => ['hhc1978#3542', 'hhc1978'],
      'Iván' => ['iván rubio piñeras#1344', 'ivanrubio', 'Ivan Rubio#4856', 'Ivan Rubio', 'Iván Rubio Piñeras'],
      'Jandrol' => ['jandrol#3454', 'jandrol'],
      'Jarlok' => ['jarlok#2458', 'jarlok', 'Jarlok #2458'],
      'Javier U.' => ['javieru#1968', 'javier_u'],
      'Joanna Devas' => ['joannadevas#7944', 'joannadevas', 'Devasjoanna'],
      'Jordi' => ['jocc#3259', 'jocc_jocc', 'JOCC/Jordi#3259', 'Jordi/JOCC'],
      'Juancho Carrillo' => ['juancho#0118', 'juancho.carrillo'],
      'Liath' => ['liath#6495'],
      'Lombyshelff' => ['lombyshelff#3449', 'lombyshelff'],
      'Lucía' => ['lucía#2598', 'lucia131', 'Lucia #2598', 'lucia#2598', 'Lucía #2598'],
      'Ramón' => ['m---nr·-#0781', 'm___nr._'],
      'Mar Calpena' => ['mcalpena#6065', 'mcalpena', 'mar calpena', 'Mcalpena@6065', 'Maria del Mar Calpena Ollé'],
      'Meekehg' => ['meekehg#2071'],
      'Ágatha' => ['mokuren#9638', 'agatha.armstrong', 'Agatha Armstrong', 'Agatha', 'Mokuren'],
      'Mr. Bergamot' => ['mrbergamot#4120', 'mrbergamot', 'Darth_Geek#4120'],
      'Nai' => ['nai#0930', 'nai'],
      'Nettuareg' => ['nettuareg#0737', 'nettuareg', 'nettuareg#737'],
      'Nuria' => ['nuria#8942', 'Nuria'],
      'Parnecitha' => ['parnecitha#0694'],
      'Pol' => ['paul henry#6167', 'paulhenryillusion', 'Pol Hernandez Molina'],
      'Pixantintes' => ['pixatintes#5635', 'pixatintes'],
      'Rainbow Panther' => ['rainbowpanther#1017', 'rainbow.panther'],
      'Ruba' => ['ruba#7078', 'ruba8roll', 'Ruba'],
      'Rudy Alvarado' => ['rudyalvarado#9504'],
      'Safman' => ['safman#5878'],
      'Severí' => ['severí#4918', 'Severí Vinyoles'],
      'Sirius Lionheart' => ['sirius lionheart#3502', 'siriuslionheart'],
      'Soto PintoyColorea' => ['soto_pintaycolorea#3412', 'soto_pintaycolorea', '#soto_pintaycolorea'],
      'Steph' => ['steph#5314', 'steph_v', 'Stefani Vila'],
      'Txi' => ['txi89#8098', 'txi89', 'Txi89 #8098'],
      'Raúl Valero' => ['valero#1635', 'valero1635'],
      'Xantra' => ['xantra#7996', '_xantra', 'xantra'],
      'Youjin' => ['youjin#4787', 'youjin'],
      'Wraith' => ['wraith#4130', 'wraith4130']
    );
  }

  protected function cleanName($discordId) {
    return strtolower(trim($discordId));
  }
}
