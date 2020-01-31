var noteMap = {
  'a': {
    frequency: 440
  },
  'a#': {
    frequency: 466.2
  },
  'b': {
    frequency: 493.9
  },
  'c': {
    frequency: 261.6
  },
  'c#': {
    frequency: 277.2
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
var globalGain = globalAudioContext.createGain() //make global gain
globalGain.gain.value = 0.2; //set global gain value directly
globalGain.connect( globalAudioContext.destination); //connect global gain to context destination

var soundDecayLength = 2;
/*
make audio context
make global gain
set global gain value directly
connect global gain to context destination
create oscillator
create local gain
connect oscillator to local gain
set local gain values
connect local gain to global gain
start oscillator
*/

function playANote(frequency) {
  //var context = new AudioContext();
  var oscillator = globalAudioContext.createOscillator();//create oscillator
  oscillator.type = "sine";
  oscillator.frequency.value = frequency
  var gainComponent = globalAudioContext.createGain();//create local gain


  oscillator.connect(gainComponent); //connect oscillator to local gain
  //add the gain filter to the oscillator before you connect the destination, like how you would plug a pedal in before the speaker
  gainComponent.gain.setValueAtTime(0.01, globalAudioContext.currentTime);//set local gain values
  gainComponent.connect( globalGain ); //connect local gain to global gain
  oscillator.connect(globalAudioContext.destination);
  oscillator.start(0);
  gainComponent.gain.linearRampToValueAtTime(0.9, globalAudioContext.currentTime + 2);

  gainComponent.gain.linearRampToValueAtTime(0.00001, globalAudioContext.currentTime + 5);
  // gainComponent.gain.linearRampToValueAtTime(
  //   1, context.currentTime + 5
  // );
  //oscillator.stop(context.currentTime + .25);
  gainComponent.connect(globalGain);
}

function handleNoteClick(event) {
  var keyPressed = event.target
  var noteName = keyPressed.getAttribute('data-key');
  var noteData = noteMap[noteName];
  playANote(noteData.frequency);
}

var keys = document.querySelectorAll('.flex-key');

for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
  keys[keyIndex].addEventListener('click', handleNoteClick );
}
