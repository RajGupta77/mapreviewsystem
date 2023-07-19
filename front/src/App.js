import * as React from 'react';

import {Map,Marker,Popup} from 'react-map-gl';
import {useState} from 'react';
import {Cancel,Room,Star} from '@material-ui/icons';
import './App.css';
import {useEffect} from 'react';
const axios=require('axios');
function App() {
    const[Pins,setPins] =useState([]);
    const [success,setSuccess]=useState(false);
    const [error,setError]=useState(false);
    const [currentUser,setCurrentUser]=useState("");
    const[userName,setUserName]=useState(null);
    const[password,setPassword]=useState(null);
    const[email,setEmail]=useState(null);
    const [register,setRegister]=useState(false);
    const [login,setLogin]=useState(false);
    const [logout,setLogout]=useState(false);

    const[currentPlaceId,setCurrentPlaceId]=useState(null);
    const[newPlace,setNewPlace]=useState(null);
    const[title,setTitle]=useState(null);
    const[desc,setDesc]=useState(null);
    const[rating,setRating]=useState(null);
    
    const [viewState, setViewState] = useState({
        longitude: -100,
        latitude: 40,
        zoom: 2
      });
    useEffect(() => {
       const funct= async ()=>{
         try{
           const result=await axios.get("http://localhost:8800/api/pins");
            setPins(result.data);
         }
         catch(err)
         {console.log("nodes")}
       }
       funct();
       
    },[]);
    const handleClick= (id,long,lat)=>{
           setCurrentPlaceId(id);
            setViewState({...viewState,latitude:lat,longitude:long});

    }
    const handleEvent=(e)=>{
      if(currentUser!=null)
      {
    const check=e.lngLat;
      setNewPlace({
        longitude:check.lng,
        latitude:check.lat
      })
    }
    }
    const handleSubmit=async(e)=>{
    
      const newPin={
        longitude:newPlace.longitude,
        latitude:newPlace.latitude,
        title:title,
        desc:desc,
        rating:rating,
        userName:currentUser
      }
    
      try{
        await axios.post("http://localhost:8800/api/pins",newPin);
        
        setNewPlace(null);
        setPins([...Pins,newPin]);
      }
      catch(err)
      {
        console.log(err);
      }
    }
    const handleRegister=async(e)=>{
     
       const newUser={
         userName:userName,
         password:password,
         email:email
       }
       try{
         await axios.post("http://localhost:8800/api/users/register",newUser);
        setSuccess(true);
       }
       catch(err)
       {
         setError(true);
         console.log(err);
       }
      
    }
    const handleLogin=async()=>{
      const checkUser={
        userName:userName,
        password:password
      }
      try{
         const res= await axios.post("http://localhost:8800/api/users/login",checkUser);
         console.log(res.data);
         setSuccess(true);
        setCurrentUser(res.data.userName);
      }
      catch(err){
        console.log(err);
        setError(true);
      }
      
    }

  return (<Map
   {...viewState}
    style={{width: '100vw', height: '100vh'}}
    mapStyle="mapbox://styles/mapbox/streets-v9" 
      onMove={evt => setViewState(evt.viewState)} 
    onViewportChange={nextViewport=>{setViewState(nextViewport)}}
    mapboxAccessToken='pk.eyJ1IjoicmFqZ3VwdGE3NyIsImEiOiJjbDJxYjF6c2owYW43M2lwYmd2amwyemZvIn0.0IBA2qj2Q4RYrMhCLJu6Fw'
    onDblClick={handleEvent}
    transtionDuration="1000ms"
  >
       {Pins.map(p =>(
         
         <>
       <Marker latitude={p.latitude} longitude={p.longitude} >
      <Room style={{fontSize:viewState.zoom*10,cursor:"pointer"}} onClick={()=>{handleClick(p._id,p.longitude,p.latitude)}}/>
        </Marker>

        {p._id === currentPlaceId && <>
        <Popup latitude={p.latitude} longitude={p.longitude} closeButton={true} closeOnClick={false} onClose={()=>setCurrentPlaceId(null)}
        anchor="left" >
        <div className='container'>
         <label>Title:</label> 
         <h3 className='title'>{p.title}</h3>
         <label>Description:</label>
         <p className='descrip'>{p.desc}</p>
         <label>Rating:</label>
         <div className='stars'>
         {  Array(p.rating).fill(<Star className='star'/>)}
          
         </div>
         <div>Marked by {p.userName}</div>
        </div>
         </Popup>
        </>
         }  
         </>
         
 ))} 
   { newPlace && <>
    <Popup latitude={newPlace.latitude} longitude={newPlace.longitude} closeButton={true} closeOnClick={false} onClose={()=>setNewPlace(null)}
        anchor="left"  >
        <div className='container'>
         <label>Title:</label> 
         <input placeholder='enter title' onChange={(e)=>setTitle(e.target.value)}/>
         <label>Description:</label>
         <input placeholder='enter description' onChange={(e)=>setDesc(e.target.value)}/>
         <label>Rating:</label>
           <select onChange={(e)=>setRating(e.target.value)}>
             <option value="1">1</option>
             <option value="2">2</option>
             <option value="3">3</option>
             <option value="4">4</option>
             <option value="5">5</option>
           </select>
           <button className='submitButtonClass' type='submit' onClick={()=>{handleSubmit()}}>Add new Marker</button>
        </div>
         </Popup>
   </>
   }
   {
     currentUser && <>
     <button className='logout' onClick={()=>setLogout(true)}> logout</button>
     </>
   }
   { !currentUser && <>

     <button className='login' onClick={()=>setLogin(true)}>Log in</button>
     <button className='register' onClick={()=>setRegister(true)}>Register</button>

   </>

   }
    {
      logout && <>
      <div className='logoutform'>
        <h3> Are you sure you want to logout?</h3>
         <button onClick={()=>{setCurrentUser(null);setLogout(false);setNewPlace(null)}}> Yes </button>
         <button onClick={()=>setLogout(false)}> NO </button>
      </div>
      </>
    }
    {
      register && <>
      <div className='registerform'>
        
        <input type='text' placeholder="UserName" className='registerInput' onChange={(e)=>setUserName(e.target.value)}/>
        
        <input type='password' placeholder="password" className='registerInput' onChange={(e)=>setPassword(e.target.value)}/>
        
        <input type='email' placeholder="email_id" className='registerInput' onChange={(e)=>setEmail(e.target.value)}/>
        <button className='registerButton' onClick={()=>{handleRegister()}}>Register</button>
        <Cancel className='registerCancel' onClick={()=>{setRegister(false);setSuccess(false);setError(false)}}/>
        {
          success && <div className='registerNotation'> Registration Success</div>
        }
        {
          error && <div className='registerNotation2'> Something went worng</div>
        }
      </div>
      </>
    }

    {
      login && <>
      <div className='registerform'>
        
        <input type='text' placeholder="UserName" className='registerInput' onChange={(e)=>setUserName(e.target.value)}/>
        
        <input type='password' placeholder="password" className='registerInput' onChange={(e)=>setPassword(e.target.value)}/>
        
        
        <button className='registerButton' onClick={()=>{handleLogin()}}>Login</button>
        <Cancel className='registerCancel' onClick={()=>{setLogin(false);setSuccess(false);setError(false)}}/>
        {
          success && <div className='registerNotation'> Login Success</div>
        }
        {
          error && <div className='registerNotation2'> Something went worng</div>
        }
      </div>
      </>
    }
   </Map>)
}
export default App;
