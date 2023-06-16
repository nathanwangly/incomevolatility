/* create timeline */
var timeline = [];

/* experiment payments */
var participation_payment = 3 /* base payment for participating */
var bonus_payment = 3 /* bonus payment if game is won */
var total_payment = participation_payment + bonus_payment /* maximum payment */

/* welcome screen */
var welcome = {
    type: jsPsychHtmlButtonResponseCustom,
  stimulus: function() {
    return '<h2>Uncertainty in Financial Decision Making</h2>' +
    '<br><br><u>About this study</u>' + 
    '<p>This study is being run by UNSW Sydney to investigate how people make financial decisions when faced with uncertainty.</p>' +
    '<p>You will make decisions around spending and saving in a financial decision making game, as well as answer some simple questionnaires.</p>' + 
    '<p>You will receive £' + participation_payment.toFixed(2) + ' for participating in this experiment and may be eligible for a bonus payment of £' + bonus_payment.toFixed(2) + ' depending on your performance in the game.</p>' +
    '<br><u>How this experiment will run:</u>' +
    '<ul><li>You will first be presented instructions that explain how the financial decision making game works.</li>' +
    '<p><li>You will then be given a few practice rounds to get familiar with the game.</li></p>' +
    '<p><li>After the practice rounds, you will begin the real experiment rounds.</li></p>' +
    '<p><li>Finally, you will be asked to provide some information about yourself and your financial situation.</li></ul></p>' +
    '<br><p>The experiment should take about 20 minutes to complete. If you have any questions or issues during or after the experiment, please contact Nathan Wang-Ly (<a href="mailto:nathan.wang-ly@unsw.edu.au">nathan.wang-ly@unsw.edu.au</a>).</p>' +
    '<br><p>Press the Continue button to proceed to the consent form for this experiment.</p>' 
  },
  choices: ['Continue']
  };
  
  /* consent screen */
  var consent = {
    type: jsPsychHtmlButtonResponseCustom,
  stimulus: function() {
    return '<b>Consent form</b>' +
    '<br><br>Please read the information below and press the button below if you consent to participating in this experiment.' +
    '<ul><li><p>I understand I am being asked to provide consent to participate in this research study;</p></li>' + 
    '<li><p>I have read the <a href="participant_info_sheet.pdf" target="_blank">Participant Information Sheet</a> or someone has read it to me in a language that I understand;</p></li>' +
    '<li><p>I understand the purposes, study tasks and risks of the research described in the study;</p></li>' + 
    '<li><p>I provide my consent for the information collected about me to be used for the purpose of this research study only;</p></li>' +
    '<li><p>I have been given contact details of the researchers to enable me to ask questions about my participation;</p></li>' + 
    '<li><p>I freely agree to participate in this research study as described and understand that I am free to withdraw at any time during the study and withdrawal will not affect my relationship with any of the named organisations and/or research team members;</p></li>' + 
    '<li><p>I understand that if I would like to receive a copy of the study results, I can contact the researchers via email (<a href="mailto:nathan.wang-ly@unsw.edu.au">nathan.wang-ly@unsw.edu.au</a>);</p></li></ul>' +
    '<p>If you do not consent, you may exit the experiment now.</p>'
  },
  choices: ['I consent to participating in this experiment']
  };
  
  /* Prolific ID screen */
  var exp_start = {
    type: jsPsychSurveyHtmlForm,
    html: 'Thank you for providing your consent. We will now begin the experiment.' +
    '<br><p>Please enter your Prolific ID and press the button below to proceed to the instructions about the financial decision making game.</p>' +
    '<br><input name="prolificid" id="prolificid" type="text" style="text-align: center;" required>' + 
    '<br><br>',
    button_label: 'Start the experiment',
    autofocus: 'prolificid',
    on_finish: function(data){
        data.participantID = data.response.prolificid;
  }
};

timeline.push(welcome)
timeline.push(consent)
timeline.push(exp_start)

// Before running the experiment, ensure that you have initialised the
// Batch session data with the condition sizes in a dictionary format.
// e.g., "Condition Sizes": {
//          "Condition 1": 0,
//          "Condition 2": 0,
//          "Condition 3": 0
//         }

// Function to direct participants to the condition with the fewest
// number of participants
function conditionAllocation() {

  // Dictionary linking condition names (in Batch Session data) to
  // component positions in JATOS
  var componentPositions = {
    "Very High Volatility": 2
  }

  // Extract current number of participants per condition from Batch Session
  var conditionSizes = jatos.batchSession.get("Condition Sizes");

  // Identify condition with fewest participants
    // Selects first condition available if there is a tie
  var conditionNames = Object.keys(conditionSizes);
  var lowestSize = Math.min.apply(null, conditionNames.map(function(x) {return conditionSizes[x]}));
  var lowestCondition = conditionNames.filter(function(y) {return conditionSizes[y] === lowestSize});
  var lowestCondition = lowestCondition[0]

  // Update Batch session data
  var newConditionSizes = conditionSizes
  newConditionSizes[lowestCondition] = lowestSize + 1
  jatos.batchSession.set("Condition Sizes", newConditionSizes)

  // Return component position corresponding to assigned condition
  return(componentPositions[lowestCondition]);
};


/* start the experiment */
jatos.onLoad(
    
    function () {
        
        var nextComponentPosition = conditionAllocation();
        
        var jsPsych = initJsPsych({
            
            timeline: timeline,
            on_load: function() {
                // track experiment completion time in experiment data
                jsPsych.data.addProperties({
                    dateTime: new Date().toLocaleString()
                });
            },
            on_finish: function() {

                // collect results
                var results = jsPsych.data.get().json();

                // pass variables to next component
                jatos.studySessionData["participantID"] = JSON.parse(results)[2]["participantID"]

                // submit results to JATOS
                jatos.submitResultData(results, jatos.startComponentByPos(nextComponentPosition));
            }
        });
        
        jsPsych.run(timeline)

});
