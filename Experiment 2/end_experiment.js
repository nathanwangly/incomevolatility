/* create timeline */
var timeline = [];

/* prolific completion code */
prolific_code = 'C14EQ346'

/* thank you screen */
var thank_you = {
    type: jsPsychHtmlButtonResponseCustom,
    stimulus: 'Thank you for participating in our study, <b>Uncertainty in Financial Decision Making</b>.' +
    '<p>Your Prolific completion code is <b>' + prolific_code + '</b>.</p>' +
    '<p>On the next and final page, we have included information about the study for those who are interested. You can now close the browser window to exit the study if you wish.</p>',
    choices: ['Read about the study']
  };

/* debrief screen */
var debrief = {
    type: jsPsychHtmlButtonResponseCustom,
    stimulus: '<b>About this study</b>' +
    '<br><p>The experience of volatile incomes is common around the world and has become increasingly so with the rise of the gig economy.</p>' + 
    "<p>Up until recently, there has been limited research investigating how uncertainty in people's income affects their financial decision making.</p>" +
    '<p>However, recent research (e.g., Peetz et al., 2021) suggests that it can lead people to be more financially impatient; for example, preferring a smaller payment sooner over a larger payment later.</p>' +
    "<p>The findings of our study can help to better understand how income volatility influences people's financial choices. This could help to uncover products, services, or interventions that will help to improve these people's financial wellbeing.</p>" +
    '<br><p>If you have any questions or concerns about the task you just completed, or encountered any difficulties while completing the task, please do not hesitate to get in touch with us:' +
    '<ul><li>Nathan Wang-Ly at <a href="mailto:nathan.wang-ly@unsw.edu.au">nathan.wang-ly@unsw.edu.au</a>' +
    '<li>Prof. Benjamin Newell at <a href="mailto:ben.newell@unsw.edu.au">ben.newell@unsw.edu.au</a>.</ul>' +
    '<br><p>Our contact details can also be found on the participant information sheet you had viewed and agreed to prior to commencing this task.</p>' +
    '<p>You can also click <a href="participant_info_sheet.pdf" target="_blank">here</a> to download the participant information sheet if you have not yet done so.</p>',
    choices: ['Finish experiment']
  };

timeline.push(thank_you);
timeline.push(debrief);

/* start the experiment */
jatos.onLoad(
    
    function () {
                
        var jsPsych = initJsPsych({
            
            timeline: timeline,
            on_finish: () => jatos.endStudy(jsPsych.data.get().json())
        
        });
        
        jsPsych.run(timeline)

});
