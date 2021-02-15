import { Track, NoteEvent, Writer } from "midi-writer-js";
import { specialNotes } from "../constants/regex";

const specialNoteRegex = new RegExp(`${specialNotes.join("|")}`, "g");

const selectNormalNotes = (score) =>
  score.filter(({ notes }) =>
    Array.isArray(notes)
      ? !notes.some((note) => specialNoteRegex.test(note))
      : !specialNoteRegex.test(notes)
  );

export default (score, { tempo }) => {
  const track = new Track();
  const normalNoteScore = selectNormalNotes(score);
  track.setTempo(tempo);

  track.addEvent(
    normalNoteScore.map(
      ({ notes }) => new NoteEvent({ pitch: notes, duration: "1" })
    )
  );

  const writer = new Writer(track);
  return writer.buildFile();
};
