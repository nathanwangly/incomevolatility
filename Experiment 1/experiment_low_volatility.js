var timeline = [];

/* experiment variables */
var n_rounds_prac = 3; /* number of practice rounds in experiment */
var n_rounds_exp = 15; /* number of real rounds in experiment */
var sequence_length = 6; /* number of characters per string in work task */

/* experiment condition and corresponding income */
var condition = 'low volatility'
// var income_array = shuffle(Array(n_rounds_exp).fill(1000)) /* stable income */
var income_array = shuffle([431, 570, 656, 794, 873, 883, 910, 990, 1158, 1202, 1277, 1279, 1311, 1326, 1340]) /* low volatility - 0.3 CV */
// var income_array = shuffle([173, 274, 466, 526, 529, 650, 661, 847, 1101, 1374, 1404, 1436, 1571, 1900, 2088]) /* high volatility - 0.6 CV */

var income_prac = 50; /* practice round income */

var emergency_cost_prac = 50; /* cost of practice financial emergency */
var emergency_cost_exp = 4500; /* cost of real financial emergency */

  /* experiment payments */
var participation_payment = 3 /* base payment for participating */
var bonus_payment = 3 /* bonus payment if game is won */
var total_payment = participation_payment + bonus_payment /* maximum payment */

  /* hypothetical bonus payment for smaller-sooner vs larger-later question */
var hypothetical_bonus = 50;

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
var full_sequence_exp = make_sequence(sequence_length * n_rounds_exp);
var task_sequences_exp = chunk_string(full_sequence_exp, sequence_length);
var task_sequences_correct_exp = Array(task_sequences_exp.length); /* initialise array */

for (let i = 0; i < task_sequences_exp.length; i++) {
  task_sequences_correct_exp[i] = task_sequences_exp[i].split('').sort().join('');
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
'<p>However, if you do not have enough saved, you will lose the game and lose all your points.</p>'
var instructions_4 = '<b>How the Game Works - Bonus Payment</b>' + 
'<br><br>Once we have finished collecting data for this experiment, the best performing participants (top 10% of scores) will receive a bonus payment of £' + bonus_payment.toFixed(2) + ' in addition to their participation payment.</p>' +
'Your goal is therefore to buy as many points as you can while still making sure you have enough saved for the financial emergency.' +
'<p>Remember: You will not be told when this emergency will occur nor how much it will cost.</p>'

var instructions = {
    type: jsPsychInstructions,
    pages: [
      instructions_1,
      instructions_2,
      instructions_3,
      instructions_4  
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
    '<p>Once you finish with the practice rounds, the points you have earned and your account balance will be reset, and you will begin the experiment rounds.</p>' +
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

var transition_to_exp = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for completing the practice rounds. You will now begin the real experiment rounds.' +
    '<p>Your points and savings balance have been reset to zero.</p>' +
    '<p>The number of rounds and the cost of the financial emergency will be different for the experiment stage.</p>' +
    '<p>Your goal remains the same: To buy as many points as you can while making sure you have enough saved for the financial emergency.</p>' +
    '<br><p><b>Important:</b> You will later be asked questions about the income you received and your decisions to spend or save so please ensure you are paying attention throughout the game.</p>'
  },
  choices: ['Begin experiment rounds'],
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

/* exp work task */
var work_task_exp = {
  type: jsPsychSurveyHtmlForm,
  html: function() {
    return '<b>Round ' + (round+1) + ' - Work task</b>' +
    '<br><br>Please sort the following letters into alphabetical order.' + 
    '<p><i>For example, the correct answer for the string "pagwlp" would be "aglppw".</i></p>' +
    '<br>' + task_sequences_exp[round] + '<br>' + 
    '<br><input name="work_task" id="work_task" type="text" style="text-align: center;" pattern="^' + task_sequences_correct_exp[round] + '$" ' + 
    'oninvalid="setCustomValidity(' + "'Please try again.');" + '"' + 
    'oninput="setCustomValidity(' + "'');" + '"' + 
    'required/></p>'
  },
  autofocus: 'work_task',
  data: {
    condition: condition,
    stage: 'exp'
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    data.round = round+1;
    data.sequence = task_sequences_exp[round];
  }
};

/* exp income screen */
var work_income_exp = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Round ' + (round+1) + '</b>' +
    '<br><br>Thank you for sorting the letters correctly.' +
    '<p>Your payment for completing your work task this round is <b>£' + income_array[round].toLocaleString('en-AU') + '.</b>' /* need to change to add commas formatting */
  },
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
    savings += income_array[round];
  }
};

var choice_trial_exp = {
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
    stage: 'exp'
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
    data.income = income_array[round];
    data.amount_spent = response;
    data.savings = savings;
    data.points_earned = points_earned;
    data.points_total = points_total;
  }
};

/* spending outcome screen */
var choice_outcome_exp = {
    type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Round ' + (round+1) + '</b>' +
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

var exp_trials = {
    timeline: [work_task_exp, work_income_exp, choice_trial_exp, choice_outcome_exp],
    repetitions: n_rounds_exp
  };

/* post-trial questions */

  /* perceived volatility */
var perceived_volatility = {
  type: jsPsychHtmlSliderResponse,
  stimulus: function() {
    return 'The financial emergency is about to occur. However, before we reveal whether you have saved enough, we would like to ask you a few questions.' +
    '<p>Your responses will not have any impact on the outcome of the game, so please answer the questions honestly.' + 
    '<br><br><br><b>On a scale of 0 to 10, how <i>volatile</i> do you think the income you received in this task was?</b>' +
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
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
  }
};

  /* perceived choice difficulty */
var perceived_difficulty = {
  type: jsPsychHtmlSliderResponse,
  stimulus: function() {
    return '<b>On a scale of 0 to 10, how <i>difficult</i> did you find it to decide how much to spend or save each round?</b><br><br>'
  },
  min: 0,
  max: 10,
  step: 1,
  slider_start: 5,
  require_movement: true,
  labels: ['0 <p>(not difficult)',
            '1', '2', '3', '4', 
            '5 <p>(moderately difficult)', 
            '6', '7', '8', '9', 
            '10 <p>(extremely difficult)'],
  slider_width: 1200,
  prompt: '<br><br>&nbsp;  ',
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
  }
};

  /* attention check */
var attention_check = {
  type: jsPsychHtmlSliderResponse,
  stimulus: function() {
    return '<b>This is an attention check question. Please select 3 on the scale to confirm you are paying attention.</b><br><br>'
  },
  min: 0,
  max: 10,
  step: 1,
  slider_start: 5,
  require_movement: true,
  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  slider_width: 1200,
  prompt: '<br><br>&nbsp;  ',
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
  }
};

  /* financial patience screen */
var financial_patience = {
  type: jsPsychSurveyHtmlForm,
  html: 'Imagine that you were given the choice between two bonus rewards for participating in this experiment.' + 
  "<p><ul><li>Option 1: Get paid a bonus payment of £" + hypothetical_bonus + " in two weeks' time" +
  '<p><li>Option 2: Get paid £X today' + 
  '<br><br><br><b>What is the lowest amount you would accept to get paid today instead of two weeks from now?</b>' +
  '<br><p><i>I would prefer to receive £___ today from now than £' + hypothetical_bonus + ' two weeks from now.</i></p><input name="ss" id="ss" type="number" value="value" min="1" max="50" style="width: 5em; height: 1.5em; font-size:1.2em; text-align: center;" required/></p>',
  autofocus: 'ss',
  data: {
    condition: condition
  },
  on_finish: function(data){
    data.participantID = jatos.studySessionData.participantID;

    var response = parseInt(data.response.ss);
    data.ss_choice = response;
  }
}

/* transition to emergency screen */
var emergency_transition = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return 'Thank you for answering the questions.' +
    '<br><p>We will now find out whether you have saved enough for the financial emergency!</p>'
  },
  choices: ['Continue'],
  data: {
    condition: condition
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;
  }
};

/* emergency screen */
var emergency_event_exp = {
    type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return '<b>Financial Emergency!</b>' + 
    '<br><br><img src="img/heavy_storm.jpg" style="border:1px solid black;" height="400"><br>' +
    '<br><br>Oh no! A heavy storm caused damage to your home and will require immediate repairs.' +
    '<p>The cost of these repairs turns out to be £' + emergency_cost_exp.toLocaleString('en-AU') + '.'
  },
  choices: ['Continue'],
  data: {
    condition: condition,
    stage: 'exp'
  },
  on_finish: function(data) {
    data.participantID = jatos.studySessionData.participantID;

    if (savings >= emergency_cost_exp) {
      outcome_exp = 'win'
    } else { 
      outcome_exp = 'lose'
    }

    data.emergency_outcome = outcome_exp;
  }
};

/* emergency outcome */
var emergency_outcome_exp = {
    type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    if (outcome_exp == 'win') {
      return '<b>Financial Emergency!</b>' + 
      '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when the financial emergency occurred.' + 
      '<p>Because you had enough saved for the emergency, you have won the game! This means you will get to keep your ' + points_total.toLocaleString('en-AU') + ' points.</p>' +
      '<p>If your points total ends up in the top 10% of participants, then you will receive an bonus payment of £' + bonus_payment.toFixed(2) + ' in addition to your £' + participation_payment.toFixed(2) + ' payment for participating in this experiment.'
    } else {
      return '<b>Financial Emergency!</b>' + 
      '<br><br>You had £' + savings.toLocaleString('en-AU') + ' in your account when the financial emergency occurred.' + 
      '<p>Unfortunately, you did not have enough saved for the emergency. This means that you have lost all of your points.' +
      '<br><br><br><b>You will, however, still receive a payment of £' + participation_payment.toFixed(2) + ' for taking part in this experiment.</b>'
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
timeline.push(instructions);

timeline.push(practice_overview);
timeline.push(prac_trials);
timeline.push(emergency_event_prac);
timeline.push(emergency_outcome_prac);

timeline.push(transition_to_exp);
timeline.push(exp_trials);

timeline.push(perceived_volatility);
timeline.push(perceived_difficulty);
timeline.push(attention_check);
timeline.push(financial_patience);

timeline.push(emergency_transition);
timeline.push(emergency_event_exp);
timeline.push(emergency_outcome_exp);

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

