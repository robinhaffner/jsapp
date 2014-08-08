<?php

header('Content-Type: application/json');

function resolveRequest() {
  switch($_GET['type']) {
    case 'program':
    case 'collection':
      $return = getData($_GET['type'],$_GET['id']);
      break;
    case 'choice':
      $return = getChoiceResponse($_GET['qid'],$_GET['cid']);
      break;
  }
  
  exit($return);
  
}

function getData($type,$id) {
  $output = readfile($type.$id.".json");
  return $output;
}

function getChoiceResponse($questionid,$choiceid) {
  
  $percents = array();
  $counts = array();
  $numchoices = isset($_GET['count']) ? $_GET['count'] : 3;
  
  $total = rand(100,1000);
  $totalamt = $total;
  
  for($i=0; $i < $numchoices-1; $i++) {
    $amt = rand(0,$totalamt);
    array_push($counts,$amt);
    array_push($percents,$amt/$total*100);
    $totalamt -= $amt;
  }
  
  array_push($counts,$totalamt);
  array_push($percents,round($totalamt/$total*100));
  
  $correct = rand(1,$numchoices);
  
  $returnobj = array(
    'status'=>'1',
    'responses'=>array(
      'total'=>$total
    ),
    'err'=>''
  );
  
  for($j=0; $j < $numchoices; $j++) {
    $returnobj['responses']['c'.($j+1)] = array(
      'percent'=>$percents[$j],
      'count'  =>$counts[$j],
      'correct'=>(int)($correct==($j+1))
    );
  }
  
  return json_encode($returnobj);
}


resolveRequest();
?>