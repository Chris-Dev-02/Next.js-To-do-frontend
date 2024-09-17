"use client"

import {useRouter} from "next/navigation";
import { useState } from "react";

function TaskCard({ task }){

    //States
    const router = useRouter()
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(task.title);
    const [newDescription, setNewDescription] = useState(task.description)

    //Event handlers
    const handleDelete = async (id) => {
        if (window.confirm('Do you want to delete this task')){
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}`,{
                method: "DELETE",

            })
            console.log(res)
            if (res.status === 204){
                router.refresh()
            }
        }
    };

    const handleTaskDone = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/done/`, {
            method: "POST",
        })
        if (res.status === 200){
            router.refresh()
        }
    };

    const handleUpdate = async (id) => {
        console.log(id)
        console.log(newTitle, newDescription)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${id}/`,{
            method: "PUT",
            body: JSON.stringify({ title: newTitle, description: newDescription}),
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json()
        console.log(data)
        setNewTitle(data.title);
        setNewDescription(data.description);

        setEdit(!edit);
    }

    return (
        <div className="bg-slate-500 px-4 py-3 mb-2 rounded-md flex justify-between items-center">

            <div className="flex flex-col">
                {!edit ? ( 
                    <h2 className="font-bold">
                        {newTitle}
                        {task.done && <span>✅</span>}
                    </h2>
                ) : (
                    <input type="text" placeholder={task.title} className="p-2 bg-slate-500 border-none outline-none text-green"
                    onChange={e => setNewTitle(e.target.value)} />
                )}

                {!edit? (
                    <p>{newDescription}</p>
                ) : (
                    <textarea name="" placeholder={task.description} className="p-2 bg-slate-500 border-none outline-none text-green w-full" rows={3}
                    onChange={e => setNewDescription(e.target.value)}
                    />
                )}
            </div>

            <div className="flex justify-between gap-x-2">

                <button 
                className={"text-white rounded-md p-2" + (task.done ? " bg-gray-800 " : " bg-green-500 ")}
                onClick={ () => handleTaskDone(task.id) }>
                    {task.done ? "Mark as undone" : "Mark as done"}
                </button>

                <button className="bg-red-500 text-white rounded-md p-2"
                onClick={ () => handleDelete(task.id) }>
                    Delete
                </button>

                {!edit ? (
                    <button className="bg-indigo-500 text-white rounded-md p-2"
                    onClick={ () => setEdit(!edit) }>
                        Edit
                    </button>
                ) : (
                    <button className="bg-slate-300 text-black rounded-md p-2" onClick={ () => handleUpdate(task.id) }>
                        Save changes
                    </button>
                )}
                
            </div>
        </div>
    );
}
export default TaskCard