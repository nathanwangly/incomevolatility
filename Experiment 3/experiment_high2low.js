var timeline = [];

/* experiment variables */
var n_rounds_prac = 3; /* number of practice rounds in experiment */
var n_rounds_exp = 15; /* number of real rounds in experiment */
var sequence_length = 6; /* number of characters per string in work task */

/* experiment condition and corresponding income */
var condition = 'high to low'
var income_array_low = shuffle([431, 570, 656, 794, 873, 883, 910, 990, 1158, 1202, 1277, 1279, 1311, 1326, 1340]) /* low volatility - 0.3 CV */
var income_array_high = shuffle([173, 274, 466, 526, 529, 650, 661, 847, 1101, 1374, 1404, 1436, 1571, 1900, 2088]) /* high volatility - 0.6 CV */

var income_prac = 50; /* practice round income */

var emergency_cost_prac = 50; /* cost of practice financial emergency */
var emergency_cost_exp_r1 = 4500; /* cost of real financial emergency in round 1*/
var emergency_cost_exp_r2 = 2500; /* cost of real financial emergency in round 2*/

  /* experiment payments */
var participation_payment = 4.5 /* base payment for participating */
var bonus_payment = 3 /* bonus payment if game is won */
var total_payment = participation_payment + bonus_payment /* maximum payment */

/* set initial values */
var round = 0;
var savings = 0;
var points_total = 0;

/* custom function for randomising order of array elements */
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

/* custom function for generating letter sequences and splitting into chunks */
function make_sequence(n_char) {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var character_length = characters.length;
  for (var i = 0; i < n_char; i++) {
    result += characters.charAt(Math.floor(Math.random() * character_length));
  }
  return(result);
};

function chunk_string (string, length) {
  const size = Math.ceil(string.length / length);
  const result = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    result[i] = string.substr(offset, length);
    offset += length;
  };

  return result;

}

/* generate sequences for experiment */

  /* practice round sequences */
var full_sequence_prac = make_sequence(sequence_length * n_rounds_prac);
var task_sequences_prac = chunk_string(full_sequence_prac, sequence_length);
var task_sequences_correct_prac = Array(task_sequences_prac.length); /* initialise array */

for (let i = 0; i < task_sequences_prac.length; i++) {
  task_sequences_correct_prac[i] = task_sequences_prac[i].split('').sort().join('');
}

  /* exp round sequences */
var full_sequence_exp_r1 = make_sequence(sequence_length * n_rounds_exp);
var task_sequences_exp_r1 = chunk_string(full_sequence_exp_r1, sequence_length);
var task_sequences_correct_exp_r1 = Array(task_sequences_exp_r1.length); /* initialise array */

for (let i = 0; i < task_sequences_exp_r1.length; i++) {
  task_sequences_correct_exp_r1[i] = task_sequences_exp_r1[i].split('').sort().join('');
}

var full_sequence_exp_r2 = make_sequence(sequence_length * n_rounds_exp);
var task_sequences_exp_r2 = chunk_string(full_sequence_exp_r2, sequence_length);
var task_sequences_correct_exp_r2 = Array(task_sequences_exp_r2.length); /* initialise array */

for (let i = 0; i < task_sequences_exp_r2.length; i++) {
  task_sequences_correct_exp_r2[i] = task_sequences_exp_r2[i].split('').sort().join('');
}

/* instructions screen */
var instructions_1 = '<b>How the Game Works - Working for Income</b>' +
'<br><br>The game will consist of multiple rounds where you will be asked to complete work tasks.' +
'<p>Your task each round will be to arrange a sequence of letters in alphabetical order (see example image below).</p>' +
'<br><img src="img/example_work_task.png" style="border:1px solid black;" height="600"><br>' +
'<br><br>After completing each work task, you will receive money as your income.</p>'
var instructions_2 = '<b>How the Game Works - Spending or Saving</b>' + 
'<br><br>Each time you receive your income, you will be asked to decide how much of your money you want to spend or save.' +
'<p>You can spend your money to buy points (1 point per £1 spent). These points will be used to determine whether you are eligible for a bonus payment.</p>' +
"<p>Any money that you don't spend will remain in your account as savings and carry over to future rounds.</p>";
var instructions_3 = '<b>How the Game Works - The Financial Emergency</b>' + 
'<br><br>At the end of the game, a financial emergency will occur that you will need to pay for.' +
'<p>If you have enough saved in your account when this happens, you will win the game and get to keep your points.</p>' +
'<p>However, if you do not have enough saved, you will lose the game and lose all your points.</p>' + 
'<br>Your goal in the game is therefore to buy as many points as you can while still making sure you have enough saved for the financial emergency.' +
'<p>Remember: You will not be told when this emergency will occur nor how much it will cost.</p>'
var instructions_4 = '<b>How the Game Works - Two Attempts</b>' +
'<br><br>You will be given the opportunity to play the game twice.' +
'<p>The timing and cost of the financial emergency may be different between attempts. The income you receive may also differ.</p>' +
'<br>The cost of the financial emergency and the outcome of each game will only be revealed once you have completed both attempts.' +
'<p>However, your performance in your first attempt will not affect the second attempt. Your points and savings will be reset to zero in between attempts.</p>'
var instructions_5 = '<b>How the Game Works - Bonus Payment</b>' +
'<br><br>After you have completed both attempts, we will add up your points from each attempt to give a final score for the experiment.' + 
'<p>If your final score is within the top 10% of participants who complete this experiment, you will receive a bonus payment of £' + bonus_payment.toFixed(2) + ' in addition to your participation payment.</p>'

var instructions = {
    type: jsPsychInstructions,
    pages: [
      instructions_1,
      instructions_2,
      instructions_3,
      instructions_4,
      instructions_5
    ],
    show_clickable_nav: true,
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    }
};

/* practice stage */
var practice_overview = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return 'You will now get to play a few practice rounds to become familiar with how everything works.' +
      '<p>Just like in the real game, a financial emergency will occur at the end of these rounds.</p>' +
      '<p>Once you finish with the practice rounds, the points you have earned and your account balance will be reset, and you will begin your first attempt at the game.</p>' +
      '<br><br>Click Continue when you are ready to begin.' + 
      '<br>&nbsp;  '
    },
    choices: ['Continue'],
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    }
  };
  
    /* practice work task */
  var work_task_prac = {
    type: jsPsychSurveyHtmlForm,
    html: function() {
      return '<b>Practice Round ' + (round+1) + ' - Work task</b>' +
      '<br><br>Please sort the following letters into alphabetical order.' + 
      '<p><i>For example, the correct answer for the string "pagwlp" would be "aglppw".</i></p>' +
      '<br>' + task_sequences_prac[round] + '<br>' + 
      '<br><input name="work_task" id="work_task" type="text" style="text-align: center;" pattern="^' + task_sequences_correct_prac[round] + '$" ' + 
      'oninvalid="setCustomValidity(' + "'Please try again.');" + '"' + 
      'oninput="setCustomValidity(' + "'');" + '"' + 
      'required/></p>'
    },
    autofocus: 'work_task',
    data: {
      condition: condition,
      stage: 'practice'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      data.round = round+1;
      data.sequence = task_sequences_prac[round];
    }
  };
  
  /* practice income screen */
  var work_income_prac = {
      type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return '<b>Practice Round ' + (round+1) + '</b>' +
      '<br><br>Thank you for sorting the letters correctly.' +
      '<p>Your payment for completing your work task this round is <b>£' + income_prac.toLocaleString('en-AU') + '.</b>' /* need to change to add commas formatting */
    },
    choices: ['Continue'],
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      savings += income_prac;
    }
  };
  
  var choice_trial_prac = {
    type: jsPsychSurveySpendSave,
    questions: [
      {prompt: function() {
        return '<b>Practice Round ' + (round+1) + '</b>' +
        '<br><br>You now have £' + savings.toLocaleString('en-AU') + ' in your account.' + /* need to change to add commas formatting */
        '<p>How much would you like to spend on points this round?'
      },
      required: true}
    ],
    data: {
      condition: condition,
      stage: 'practice'
    },
    on_finish: function(data) {
  
    data.participantID = jatos.studySessionData.participantID;
  
      /* extract response from trial */
      response = parseInt(data.response.Q0);
  
      /* subtract from account balance */
      savings -= response;
  
      /* add to points total */
      points_earned = response;
      points_total += points_earned;
  
      /* save data */
      data.round = round+1;
      data.income = income_prac; 
      data.amount_spent = response;
      data.savings = savings;
      data.points_earned = points_earned;
      data.points_total = points_total;
    }
  };
  
  /* spending outcome screen */
  var choice_outcome_prac = {
      type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return '<b>Practice Round ' + (round+1) + '</b>' +
      '<br><br><b>Your spending has bought ' + points_earned.toLocaleString('en-AU') + ' points this round.</b>' + 
      '<br><br>Your new points total is ' + points_total.toLocaleString('en-AU') + ' points.' +
      '<p>You have £' + savings.toLocaleString('en-AU') + ' remaining in your account.'
    },
    choices: ['Continue'],
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      round += 1;
    }
  };
  
  var prac_trials = {
      timeline: [work_task_prac, work_income_prac, choice_trial_prac, choice_outcome_prac],
      repetitions: n_rounds_prac
    };
  
  /* practice emergency screen */
  var emergency_event_prac = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return '<b>Practice Financial Emergency!</b>' + 
      '<br><br><img src="img/parking_fine.jpg" style="border:1px solid black;" height="400"><br>' +
      '<br><br>Oh no! You misread a parking sign while out at the shops and have received a parking ticket.' +
      '<p>The cost of the fine will be £' + emergency_cost_prac.toLocaleString('en-AU') + '.'
    },
    choices: ['Continue'],
    data: {
      condition: condition,
      stage: 'practice'
    },
    on_finish: function(data) {
  
    data.participantID = jatos.studySessionData.participantID;
  
      if (savings >= emergency_cost_prac) {
        outcome_prac = 'win'
      } else { 
        outcome_prac = 'lose'
      }
  
      data.emergency_outcome = outcome_prac;
    }
  };
  
  /* emergency outcome */
  var emergency_outcome_prac = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      if (outcome_prac == 'win') {
        return '<b>Practice Financial Emergency!</b>' + 
        '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when the financial emergency occurred.' + 
        '<p>Because you had enough saved for the emergency, you have won the (practice) game!</p>' +
        '<p>If this were the real game, this would mean you would get to keep your ' + points_total + ' points.</p>'
      } else {
        return '<b>Practice Financial Emergency!</b>' + 
        '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when the financial emergency occurred.' + 
        '<p>Unfortunately, you did not have enough saved for the emergency.</p>' + 
        '<p>If this were the real game, this would mean you would lose all of your points.</p>'
      }
    },
    choices: ['Continue'],
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    }
  };

  /* transition to attempt 1 */
  var transition_to_exp_r1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return 'Thank you for completing the practice rounds. You will now begin your first attempt at the game.' +
      '<p>Your points and savings balance have been reset to zero.</p>' +
      '<p>The number of rounds and the cost of the financial emergency will be different for the real games.</p>' +
      '<p>Your goal remains the same: To buy as many points as you can while making sure you have enough saved for the financial emergency.</p>' +
      '<br><p><b>Important:</b> You will later be asked about the income you received so please ensure you are paying attention throughout the game.</p>'
    },
    choices: ['Begin first attempt'],
    data: {
      condition: condition
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      savings = 0;
      points_total = 0;
      round = 0;
    }
  };

var post_prac = {
  timeline: [emergency_event_prac, emergency_outcome_prac, transition_to_exp_r1]
};

  /* exp work task */
var work_task_exp_r1 = {
    type: jsPsychSurveyHtmlForm,
    html: function() {
      return '<b>Round ' + (round+1) + ' - Work task</b>' +
      '<br><br>Please sort the following letters into alphabetical order.' + 
      '<p><i>For example, the correct answer for the string "pagwlp" would be "aglppw".</i></p>' +
      '<br>' + task_sequences_exp_r1[round] + '<br>' + 
      '<br><input name="work_task" id="work_task" type="text" style="text-align: center;" pattern="^' + task_sequences_correct_exp_r1[round] + '$" ' + 
      'oninvalid="setCustomValidity(' + "'Please try again.');" + '"' + 
      'oninput="setCustomValidity(' + "'');" + '"' + 
      'required/></p>'
    },
    autofocus: 'work_task',
    data: {
      condition: condition,
      stage: 'exp_r1'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      data.round = round+1;
      data.sequence = task_sequences_exp_r1[round];
    }
  };
  
  /* exp income screen */
  var work_income_exp_r1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return '<b>Round ' + (round+1) + '</b>' +
      '<br><br>Thank you for sorting the letters correctly.' +
      '<p>Your payment for completing your work task this round is <b>£' + income_array_high[round].toLocaleString('en-AU') + '.</b>' /* need to change to add commas formatting */
    },
    choices: ['Continue'],
    data: {
      condition: condition,
      stage: 'exp_r1'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      savings += income_array_high[round];
    }
  };
  
  var choice_trial_exp_r1 = {
    type: jsPsychSurveySpendSave,
    questions: [
      {prompt: function() {
        return '<b>Round ' + (round+1) + '</b>' +
        '<br><br>You now have £' + savings.toLocaleString('en-AU') + ' in your account.' + /* need to change to add commas formatting */
        '<p>How much would you like to spend on points this round?'
      },
      required: true}
    ],
    data: {
      condition: condition,
      stage: 'exp_r1'
    },
    on_finish: function(data) {
  
    data.participantID = jatos.studySessionData.participantID;
  
      /* extract response from trial */
      response = parseInt(data.response.Q0);
  
      /* subtract from account balance */
      savings -= response;
  
      /* add to points total */
      points_earned = response;
      points_total += points_earned;
  
      /* save response */
      data.round = round+1;
      data.income = income_array_high[round];
      data.amount_spent = response;
      data.savings = savings;
      data.points_earned = points_earned;
      data.points_total = points_total;
    }
  };
  
  /* spending outcome screen */
  var choice_outcome_exp_r1 = {
      type: jsPsychHtmlButtonResponse,
    stimulus: function() {
      return '<b>Round ' + (round+1) + '</b>' +
      '<br><br><b>Your spending has bought ' + points_earned.toLocaleString('en-AU') + ' points this round.</b>' + 
      '<br><br>Your new points total is ' + points_total.toLocaleString('en-AU') + ' points.' +
      '<p>You have £' + savings.toLocaleString('en-AU') + ' remaining in your account.'
    },
    choices: ['Continue'],
    data: {
      condition: condition,
      stage: 'exp_r1'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
      round += 1;
    }
  };
  
  var exp_trials_r1 = {
      timeline: [work_task_exp_r1, work_income_exp_r1, choice_trial_exp_r1, choice_outcome_exp_r1],
      repetitions: n_rounds_exp
    };

/* emergency screen */
var emergency_event_exp_r1 = {
  type: jsPsychHtmlButtonResponse,
stimulus: function() {
  return '<b>Financial Emergency!</b>' + 
  '<br><br><img src="img/heavy_storm.jpg" style="border:1px solid black;" height="400"><br>' +
  '<br><br>Oh no! A heavy storm caused damage to your home and will require immediate repairs.' +
  '<p>You ended your first attempt of the game with ' + points_total.toLocaleString('en-AU') + ' points and £' + savings.toLocaleString('en-AU') + ' saved.</p>' +
  '<p>We will reveal the cost of the repairs and whether you had enough saved after you have completed your second attempt.</p>'
},
choices: ['Continue'],
data: {
  condition: condition,
  stage: 'exp_r1'
},
on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;

  if (savings >= emergency_cost_exp_r1) {
    outcome_exp_r1 = 'win';
    score_r1 = points_total;
  } else { 
    outcome_exp_r1 = 'lose';
    score_r1 = 0;
  }

  data.emergency_outcome_r1 = outcome_exp_r1;
}
};

/* perceived volatility */
var perceived_volatility_r1 = {
    type: jsPsychHtmlSliderResponse,
    stimulus: function() {
      return 'Before we proceed to the second attempt, we would like you to respond to the question below.' +
      '<p>Your response will not have any impact on the outcome of the game, so please answer the question honestly.</p>' + 
      '<br><br><br><b>On a scale of 0 to 10, how <i>volatile</i> do you think the income you received in this attempt was?</b>' +
      '<p>You could think of volatility as reflecting how well you could predict the income you would receive if there was another round.</p>' +
      '<p>The <i>higher</i> the volatility, the <i>less likely</i> you would be to predict this correctly.'

    },
    min: 0,
    max: 10,
    step: 1,
    slider_start: 5,
    require_movement: true,
    labels: ['0 <p>(not volatile)',
            '1', '2', '3', '4', 
            '5 <p>(moderately volatile)',
              '6', '7', '8', '9', 
            '10 <p>(extremely volatile)'],
    slider_width: 1200,
    prompt: '<br><br>&nbsp;  ',
    choices: ['Continue'],
    data: {
      condition: condition,
      stage: 'exp_r1'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    }
  };

/* transition to attempt 2 */
var transition_to_exp_r2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for answering the question. Your performance in the first attempt has been recorded and we will now begin the second attempt when you press the button below.' +
    '<p>As this is a new attempt, your points and savings balance have been reset to zero.</p>' +
    '<p>Your goal remains the same: To buy as many points as you can while making sure you have enough saved for the financial emergency.</p>' +
    '<br><p><b>Remember:</b> The timing and cost of the financial emergency may be different for this attempt. The income you receive may also differ.</p>'
  },
  choices: ['Begin second attempt'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
    savings_r1 = savings; // store final savings from first attempt
    points_total_r1 = points_total; // store final points from first attempt
    savings = 0;
    points_total = 0;
    round = 0;
  }
};

var post_exp_r1 = {
  timeline: [emergency_event_exp_r1, perceived_volatility_r1, transition_to_exp_r2]
};

/* exp work task */
var work_task_exp_r2 = {
  type: jsPsychSurveyHtmlForm,
  html: function() {
    return '<b>Round ' + (round+1) + ' - Work task</b>' +
    '<br><br>Please sort the following letters into alphabetical order.' + 
    '<p><i>For example, the correct answer for the string "pagwlp" would be "aglppw".</i></p>' +
    '<br>' + task_sequences_exp_r2[round] + '<br>' + 
    '<br><input name="work_task" id="work_task" type="text" style="text-align: center;" pattern="^' + task_sequences_correct_exp_r2[round] + '$" ' + 
    'oninvalid="setCustomValidity(' + "'Please try again.');" + '"' + 
    'oninput="setCustomValidity(' + "'');" + '"' + 
    'required/></p>'
  },
  autofocus: 'work_task',
  data: {
    condition: condition,
    stage: 'exp_r2'
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
    data.round = round+1;
    data.sequence = task_sequences_exp_r2[round];
  }
};
  
/* exp income screen */
var work_income_exp_r2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Round ' + (round+1) + '</b>' +
    '<br><br>Thank you for sorting the letters correctly.' +
    '<p>Your payment for completing your work task this round is <b>£' + income_array_low[round].toLocaleString('en-AU') + '.</b>' /* need to change to add commas formatting */
  },
  choices: ['Continue'],
  data: {
    condition: condition,
    stage: 'exp_r2'
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
    savings += income_array_low[round];
  }
};

var choice_trial_exp_r2 = {
  type: jsPsychSurveySpendSave,
  questions: [
    {prompt: function() {
      return '<b>Round ' + (round+1) + '</b>' +
      '<br><br>You now have £' + savings.toLocaleString('en-AU') + ' in your account.' + /* need to change to add commas formatting */
      '<p>How much would you like to spend on points this round?'
    },
    required: true}
  ],
  data: {
    condition: condition,
    stage: 'exp_r2'
  },
  on_finish: function(data) {

  data.participantID = jatos.studySessionData.participantID;

    /* extract response from trial */
    response = parseInt(data.response.Q0);

    /* subtract from account balance */
    savings -= response;

    /* add to points total */
    points_earned = response;
    points_total += points_earned;

    /* save response */
    data.round = round+1;
    data.income = income_array_low[round];
    data.amount_spent = response;
    data.savings = savings;
    data.points_earned = points_earned;
    data.points_total = points_total;
  }
};

/* spending outcome screen */
var choice_outcome_exp_r2 = {
    type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Round ' + (round+1) + '</b>' +
    '<br><br><b>Your spending has bought ' + points_earned.toLocaleString('en-AU') + ' points this round.</b>' + 
    '<br><br>Your new points total is ' + points_total.toLocaleString('en-AU') + ' points.' +
    '<p>You have £' + savings.toLocaleString('en-AU') + ' remaining in your account.'
  },
  choices: ['Continue'],
  data: {
    condition: condition,
    stage: 'exp_r2'
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
    round += 1;
  }
};

var exp_trials_r2 = {
    timeline: [work_task_exp_r2, work_income_exp_r2, choice_trial_exp_r2, choice_outcome_exp_r2],
    repetitions: n_rounds_exp
  };

/* emergency screen */
var emergency_event_exp_r2 = {
  type: jsPsychHtmlButtonResponse,
stimulus: function() {
  return '<b>Financial Emergency!</b>' + 
  '<br><br><img src="img/car_breakdown.jpg" style="border:1px solid black;" height="400"><br>' +
  '<br><br>Oh no! Your car broke down on the drive home from work and will require immediate repairs.' +
  '<p>You ended your second attempt of the game with ' + points_total.toLocaleString('en-AU') + ' points and £' + savings.toLocaleString('en-AU') + ' saved.</p>' +
  '<p>We will reveal the cost of the repairs once you have answered the question on the next screen.</p>'
},
choices: ['Continue'],
data: {
  condition: condition,
  stage: 'exp_r2'
},
on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;

  if (savings >= emergency_cost_exp_r2) {
    outcome_exp_r2 = 'win';
    score_r2 = points_total;
  } else { 
    outcome_exp_r2 = 'lose';
    score_r2 = 0;
  }

  data.emergency_outcome_r2 = outcome_exp_r2;
}
};

/* perceived volatility */
var perceived_volatility_r2 = {
    type: jsPsychHtmlSliderResponse,
    stimulus: function() {
      return 'As with the previous attempt, please respond to the question below.' +
      '<p>Once again, your response will not have any impact on the outcome of the game, so please answer the question honestly.</p>' + 
      '<br><br><br><b>On a scale of 0 to 10, how <i>volatile</i> do you think the income you received in this attempt was?</b>' +
      '<p>You could think of volatility as reflecting how well you could predict the income you would receive if there was another round.</p>' +
      '<p>The <i>higher</i> the volatility, the <i>less likely</i> you would be to predict this correctly.'
    },
    min: 0,
    max: 10,
    step: 1,
    slider_start: 5,
    require_movement: true,
    labels: ['0 <p>(not volatile)',
            '1', '2', '3', '4', 
            '5 <p>(moderately volatile)',
              '6', '7', '8', '9', 
            '10 <p>(extremely volatile)'],
    slider_width: 1200,
    prompt: '<br><br>&nbsp;  ',
    choices: ['Continue'],
    data: {
      condition: condition,
      stage: 'exp_r2'
    },
    on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    }
  };

/* transition to financial emergency */
var transition_to_emergency = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for completing both attempts at the game.' +
    '<p>We will now reveal how much the financial emergency cost in each game and whether you had enough saved.</p>' + 
    '<p>Press the button below when you are ready to find out how you performed.</p>'
  },
  choices: ['See results'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
  }
};

var post_exp_r2 = {
  timeline: [emergency_event_exp_r2, perceived_volatility_r2, transition_to_emergency]
};

var emergency_outcome_r1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for completing both attempts at the game.' +
    '<p>We will now reveal how much the financial emergency cost in each game and whether you had enough saved.</p>' + 
    '<p>Press the button below when you are ready to continue.</p>'
  },
  choices: ['See results'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
  }
};

/* emergency outcomes */
var emergency_outcome_exp_r1 = {
  type: jsPsychHtmlButtonResponse,
stimulus: function() {
  if (outcome_exp_r1 == 'win') {
    return '<b>Financial Emergency - Attempt 1</b>' + 
    '<br><br>You had £' + savings_r1.toLocaleString('en-AU') + ' in your account when the storm hit.' + 
    '<p>The repairs ended up costing £' + emergency_cost_exp_r1.toLocaleString('en-AU') + '.</p>' +
    '<p>Because you had enough saved for the emergency, you have won the game! This means you will get to keep your ' + points_total_r1.toLocaleString('en-AU') + ' points.</p>'
  } else {
    return '<b>Financial Emergency - Attempt 1</b>' + 
    '<br><br>You had £' + savings_r1.toLocaleString('en-AU') + ' in your account when the storm hit.' + 
    '<p>The repairs ended up costing £' + emergency_cost_exp_r1.toLocaleString('en-AU') + '.</p>' +
    '<p>Unfortunately, you did not have enough saved for the emergency. This means that you have lost all of your points from the first attempt.'
  }
},
choices: ['Continue'],
data: {
  condition: condition
},
on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
}
};

var emergency_outcome_exp_r2 = {
  type: jsPsychHtmlButtonResponse,
stimulus: function() {
  if (outcome_exp_r2 == 'win') {
    return '<b>Financial Emergency - Attempt 2</b>' + 
    '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when your car broke down.' + 
    '<p>The repairs ended up costing £' + emergency_cost_exp_r2.toLocaleString('en-AU') + '.</p>' +
    '<p>Because you had enough saved for the emergency, you have won the game! This means you will get to keep your ' + points_total.toLocaleString('en-AU') + ' points.</p>'
  } else {
    return '<b>Financial Emergency - Attempt 1</b>' + 
    '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when your car broke down.' + 
    '<p>The repairs ended up costing £' + emergency_cost_exp_r2.toLocaleString('en-AU') + '.</p>' +
    '<p>Unfortunately, you did not have enough saved for the emergency. This means that you have lost all of your points from the second attempt.'
  }
},
choices: ['Continue'],
data: {
  condition: condition
},
on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
  final_score = score_r1 + score_r2;
  data.final_score = final_score;
}
};

/* final experiment score */
var final_score = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Final Score</b>' +
    '<br><br>Your score in Attempt 1 was: ' + score_r1.toLocaleString('en-AU') + ' points.' + 
    '<p>Your score in Attempt 2 was: ' + score_r2.toLocaleString('en-AU') + ' points.</p>' + 
    '<p>Your total score for this experiment is: ' + final_score.toLocaleString('en-AU') + ' points.</p>' +
    '<br><p>If your points total ends up in the top 10% of participants, then you will receive an bonus payment of £' + bonus_payment.toFixed(2) + ' in addition to your £' + participation_payment.toFixed(2) + ' payment for participating in this experiment.</p>'
  },
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
  data.participantID = jatos.studySessionData.participantID;
  }
};

var experiment_scores = {
  timeline: [emergency_outcome_exp_r1, emergency_outcome_exp_r2, final_score]
};

/* final questionnaire */
var questionnaire_intro = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for playing the financial decision making game.' + 
    '<p>For the final part of this experiment, we would like to ask a few questions about yourself and your current situation.'
  },
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
  }
};

  /* demographic questions */
var questionnaire_demographic = {
  type: jsPsychSurveyMultiChoiceCustom,
  preamble: '<br><b>Part 1 of 2: Demographic questions</b>',
  questions: [
    {
      prompt: 'What is your age?',
      name: 'age',
      options: ['18-24 years old', '25-34 years old', '35-44 years old', '45-54 years old', '55-64 years old', '65 years or older', 'Prefer not to say'],
      required: true
    },
    
    {
      prompt: 'What is your gender?',
      name: 'gender',
      options: ['Male', 'Female', 'Non-binary/gender fluid', 'Different identity', 'Prefer not to say'],
      required: true
    },

    {
      prompt: 'What is your highest completed level of education?',
      name: 'education',
      options: ['Did not complete high school', 'High school graduate', "Undergraduate degree (e.g., Bachelor's degree)", "Postgraduate (e.g., Master's or Doctoral degree)", 'Prefer not to say'],
      required: true
    },
  ],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;

    var responses = data.response;

    data.age = responses.age;
    data.gender = responses.gender;
    data.education = responses.education;

  }
};

  /* financial and employment questions */
var questionnaire_financial = {
  type: jsPsychSurveyMultiChoiceCustom,
  preamble: '<br><b>Part 2 of 2: Financial and employment questions</b>',
  questions: [
    {
      prompt: 'Which of the following best describes your current employment status?',
      name: 'employment',
      options: ['Full-time', 'Part-time', 'Contract/Temporary', 'Student', 'Unemployed', 'Unable to work', 'Other', 'Prefer not to say'],
      required: true
    },
    
    {
      prompt: 'If applicable, how frequently are you paid from your main source of income?',
      name: 'payfreq',
      options: ['Weekly', 'Fortnightly', 'Monthly', 'Other', 'Not applicable', 'Prefer not to say'],
      required: true
    },

    {
      prompt: 'What is your annual personal income (before taxes)?',
      name: 'annincome',
      options: ['Negative or nil income', '£0-£9,999', '£10,000-£19,999', '£20,000-£29,999', '£30,000-£39,999', '£40,000-£49,999', '£50,000-£59,999', '£60,000-£69,999', '£70,000 or more', 'Prefer not to say'],
      required: true
    },
  ],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;

    var responses = data.response;

    data.employment = responses.employment;
    data.pay_freq = responses.payfreq;
    data.annual_income = responses.annincome;

  }
};

var questionnaire = {
  timeline: [questionnaire_intro, questionnaire_demographic, questionnaire_financial]
};

  /* push to timeline */
// instructions
  timeline.push(instructions);

// practice stage
timeline.push(practice_overview);
timeline.push(prac_trials);
timeline.push(post_prac);

// experiment stage - attempt 1
timeline.push(exp_trials_r1);
timeline.push(post_exp_r1);

// experiment stage - attempt 2
timeline.push(exp_trials_r2);
timeline.push(post_exp_r2);

// emergency outcomes and experiment score
timeline.push(experiment_scores);

// demographic and financial questionnaires
timeline.push(questionnaire);

/* start the experiment */
jatos.onLoad(
    
  function () {
            
      var jsPsych = initJsPsych({
          
          timeline: timeline,
          on_finish: function() {
            // collect results
            var results = jsPsych.data.get().json();

            // submit results to JATOS
            jatos.submitResultData(results, jatos.startLastComponent);
          }
          
      });
      
      jsPsych.run(timeline)

});