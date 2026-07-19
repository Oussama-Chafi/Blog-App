import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetOnePostQuery, useUpdatePostMutation } from "../redux-toolkit/features/posts/postsApiSlice"
import { useEffect } from "react";


const UpdatePostComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    const {data :post , isError , isLoading , error  } = useGetOnePostQuery(id)

    const [newUpdate , setNewUpdate] = useState({
        title : "",
        content : ""
    })
    useEffect(() => {
      if(post){
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNewUpdate({ 
          title : post.title,
          content : post.content,
        })
      }
    } , [post])
    const [updatePost , {isError : iserror , isLoading : isloading , isSuccess : issuccess , error : Error}] = useUpdatePostMutation()
    const handelSubmit = async(e) =>{
        e.preventDefault();
        try {
            await updatePost({newUpdate , id})
            alert("the post has updated")
            navigate(`/posts/get/${id}`)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
       <form onSubmit={handelSubmit}>
        <fieldset>
          <label htmlFor="title">title</label>
          <input
            type="text"
            name="titel"
            required
            id="title"
            value={newUpdate?.title}
            onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            required
            placeholder="Enter your post contnet"
            value={newUpdate?.content}
            onChange={(e) =>
              setNewUpdate({ ...newUpdate, content: e.target.value })
            }
          ></textarea>
        </fieldset>
        <button disabled={isloading} type="submit">
          {isloading ? "Updating the Post" : "Update Post"}
        </button>
      </form>
      {isLoading && <p>geting the post please wait </p>}
      {isError && <p>{error?.data?.message}</p>}
      {iserror && <p>{Error?.data?.message}</p>}
      {issuccess && <p>Updating successfully</p>}
    </div>
  )
}

export default UpdatePostComponent
