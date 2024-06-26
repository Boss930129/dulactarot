import { useEffect, useState } from 'react'
import { cards } from '../cards.js'
import { format, parseJSON } from 'date-fns'

export default function JournalEntry (props) {
    const [ newnotes, setNewNotes ] = useState(props.props.notes)
    const [ caution, setCaution ] = useState(false);
    const [ deleted, setDeleted ] = useState(false);
    const [ deleting, setDeleting ] = useState(false);
    const [ showEdit, setShowEdit ] = useState(true);
    const [ editing, setEditing ] = useState(false);
    const [ submittingEdit, setSubmittingEdit ] = useState(false);
    const [ edited, setEdited ] = useState(false);
    const [ details, setDetails ] = useState(false);
    const deleteItem = props.props.id;

    

    const deleteReading = async() => {
      setCaution(false);
      setDeleting(true);
        const readingId = deleteItem;
        try {
          const body = {readingId};
          await fetch(`/api/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          setDeleted(true);
        } catch (error) {
          console.error(error)
        }
        setDeleting(false);
      }

      function editReading () {
        showEdit(false);
        setEditing(true);
      }

      const submitEdit = async() => {
        setEditing(false);
        setSubmittingEdit(true);
          const readingId = deleteItem;
          const readingNotes = newnotes;
          console.log(readingId)
          console.log(readingNotes)
          const body = { readingId, readingNotes };
          console.log(body)
          try {
            await fetch(`/api/edit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            setEdited(true);
          } catch (error) {
            console.error(error)
          }
        setSubmittingEdit(false);
        setEdited(true);
        }

    if (deleted == true) {
        return (
            <div className="p-61 text-center bg-white">
                <p>✨ entry has been deleted ✨</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center text-center">
            <h2 className="font-bebas text-xl lg:text-2xl text-center p-2">{format(parseJSON(props.props.createdAt), 'PPPP')}</h2>
            {props.props.type == 'yesno' && <h3>✨ Yes or No ✨</h3>}
            {props.props.type == 'pastpresentfuture' && <h3>✨ Past, Present, Future ✨</h3>}
            {props.props.type == 'celticcross' && <h3>✨ Celtic Cross ✨</h3>}
            <div>
              {!editing && <button onClick={() => setEditing(true)}  className="p-2 m-2 bg-yellow-200 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">edit</button>}
              {editing && <button onClick={() => submitEdit()} className="p-2 m-2 bg-yellow-200 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">submit</button>}
              {submittingEdit && <button className="p-2 m-2 bg-yellow-200 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">submitting...</button>}
              {edited && <button className="p-2 m-2 bg-yellow-200 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">updated! ✨</button>}
              
                {!caution && !deleting &&
                    <button onClick={() => setCaution(true)} className="m-2 bg-yellow-200 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">delete</button>
                }
                {caution &&
                    <div>
                        <p className="pb-2">you sure?</p>
                        <button onClick={() => deleteReading()} className="m-2 bg-red-300 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">yes, delete!</button>
                    </div>
                }
                {deleting &&
                    <div>
                        <button className="m-2 bg-red-300 bg-opacity-20 hover:bg-opacity-80 p-2 rounded-xl transition-all">deleting...</button>
                    </div>
                }
            </div>
            {!editing && <p className="text-center p-2">Notes: {newnotes}</p>}
            {editing && 
            <div>
              <textarea input="text" label="editingtext" onChange={(e) => {setNewNotes(e.target.value)}} className="p-4 m-2 focus:outline-none text-center">{newnotes}</textarea>
            </div>
            }
            <button onClick={() => setDetails(true)} className="font-bebas text-lg p-2 m-2 bg-black text-white">Meaning</button>
            <div className="flex flex-row flex-wrap justify-center text-center align-center content-center p-2 max-w-xl">
                  { props.props.result.map( (result) => {
                      return (
                        <div key={cards[result].id} className="p-2 flex flex-row flex-wrap justify-center items-center align-center text-center max-w-lg overflow-auto">
                          <img src={cards[result].image} className="rounded-xl h-40 max-w-fit"/>
                        </div>
                      );
                  })}
                
                { props.props.result.map( (result) => {
                      return (
                        <div key={cards[result].id} className="p-2 flex flex-col justify-center items-center align-center text-center max-w-lg max-h-96 overflow-y-auto">
                          {details &&
                          <div className="p-2 flex flex-col justify-center items-center align-center text-center max-w-lg">
                            <h3 className="font-bebas text-lg xl:text-xl p-2 max-w-xs">{cards[result].name}</h3>
                            <p className="text-xs xl:text-sm">{cards[result].description}</p>
                          </div>
                          }
                        </div>
                      );
                  })}
            </div>
        </div>
    )
}