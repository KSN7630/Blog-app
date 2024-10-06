import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from './../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef=useRef();
  const [imageFileUploadingProgress,setImageFileUploadingProgress ]=useState(null);
  const [imageFileUploadError,setImageFileUploadError]=useState(null);
 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect( ()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile])

  const uploadImage=async ()=>{
    const storage=getStorage(app);
    const filename=new Date()+imageFile.name;
    const storageRef=ref(storage,filename);
    const uploadTask = uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress= (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError('Could not upload image (File must be less than 2mb)');
        setImageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
          setImageFileUrl(downloadUrl);
        });
      }
    )

  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filePickerRef.current.click()}>
          
          {imageFileUploadingProgress && (
            <CircularProgressbar value={imageFileUploadingProgress || 0} maxValue={100} text={`${imageFileUploadingProgress}%`}   strokeWidth={5} 
              styles={{
                root:{
                  width:'100%',
                  height:'100%',
                  position:'absolute'
                },
                path:{
                  stroke: `rgba(62,152,199 ,${imageFileUploadingProgress /100})`
                }
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
           className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
            imageFileUploadingProgress && imageFileUploadingProgress <100 && 'opacity-60'
           }`} />

        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone={'purpleToBlue'}>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign-Out</span>
      </div>
    </div>
  )
}
