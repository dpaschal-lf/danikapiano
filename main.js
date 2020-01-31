/*using an object for vital information for each note allows me to use the object lookup power
I could have used it for the colors, as well, but I decided to do that with CSS to take
advantage of the n notation for extra keys, but if I wanted more control, I would put
the color into the noteMap object

*/

var noteMap = {
  'a': {
    frequency: 440,
  },
  'a#': {
    frequency: 466.2,
  },
  'b': {
    frequency: 493.9,
  },
  'c': {
    frequency: 261.6,
  },
  'c#': {
    frequency: 277.2,
  },
  'd': {
    frequency: 293.7
  },
  'd#': {
    frequency: 311.1
  },
  'e': {
    frequency: 329.6
  },
  'f': {
    frequency: 349.2
  },
  'f#': {
    frequency: 370.0
  },
  'g': {
    frequency: 392.0
  },
  'g#': {
    frequency: 415.3
  },
}
var globalAudioContext = new AudioContext(); //make audio context
// var globalGain = globalAudioContext.createGain() //make global gain
// globalGain.gain.value = 0.2; //set global gain value directly
// globalGain.connect( globalAudioContext.destination); //connect global gain to context destination

var soundDecayLength = .25;
var sustainLength = .5;
var soundBuildLength = .01;


function playANote(frequency) {
/*
make audio context
create gain, attach to audio context
set local gain values
create oscillator, connecto to gain
start oscillator
set local gain's rise value + time
set local gain's fall value + time
*/
  var oscillator = globalAudioContext.createOscillator();//create oscillator, this makes the sound itself
  oscillator.type = "sine"; //this makes a smooth note, as opposed triangle or sawtooth which would give different sound qualities
  oscillator.frequency.value = frequency //play the specified note.  middle A is 440 hertz
  var gainComponent = globalAudioContext.createGain(); //this will control the amplitude, basically the volume
  gainComponent.connect(globalAudioContext.destination); //hook the gain up to the speaker output

  oscillator.connect(gainComponent); //hook the oscillator to the gain.  this is like hooking a guitar to a pedal and the pedal to an amp/speaker
  gainComponent.gain.setValueAtTime(0.01, globalAudioContext.currentTime);//set the initial gain to a very quiet (basically off) amplitude
  
  oscillator.start(0); //tell the oscillator to start now (you can give it numbers to start in the future)
  gainComponent.gain.exponentialRampToValueAtTime(0.9, globalAudioContext.currentTime + soundBuildLength); //tell the gain to ramp up to almost full power in the given time.  exponential ramps up quickly like how the human ear expects as opposed to linear which is a very smooth transition

  gainComponent.gain.exponentialRampToValueAtTime(0.00001, globalAudioContext.currentTime + sustainLength+ soundDecayLength); //tell the gian to ramp down to almost 0 in the future.  you can't go to 0

}

function handleNoteClick(event) {
  var keyPressed = event.target //get the element that was clicked
  event.target.classList.add('playing'); //add this class so that CSS can highlight it the color we want
  var noteName = keyPressed.getAttribute('data-key'); //go to the attribute and find out what note was clicked
  var noteData = noteMap[noteName]; //get the data from our map above for this particular note

  setTimeout( function(){ //wait the amount of time the note will play, and then remove the playing class so the color disappears
    event.target.classList.remove('playing');
  }, ( sustainLength + soundBuildLength) * 1000)
  playANote(noteData.frequency); //tell our note playing function to play the given note
}

var keys = document.querySelectorAll('.flex-key'); //select all keys

for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) { //go through each key and add a click handler onto it.  could have also done a delegate listener on the parent
  keys[keyIndex].addEventListener('click', handleNoteClick );
}

document.addEventListener('keydown', function(event){
  var letter = event.key.toLowerCase();
  var targetKey = document.querySelector('.flex-key[data-trigger='+letter+']');
  if(!targetKey){
    return;
  }
  targetKey.click();
})
