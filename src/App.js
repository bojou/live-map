import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from 'react'
import useSwr from 'swr'
import GoogleMapReact from 'google-map-react'
import useSuperCluster from 'use-supercluster';
import superagent from 'superagent'

/*
const request = superagent('POST', 'https://api.vasttrafik.se/token');
request.set({ Authorization: 'Basic ' + process.env.REACT_APP_TOKEN_CREDENTIALS });
const token = async => request.send('grant_type=client_credentials&scope=device_' + process.env.REACT_APP_TOKEN_DEVICE)
  .then(response => response.body.access_token)

const fetcher = (...args) => fetch(...args, {
  headers: new Headers({
    'Authorization': 'Bearer ' + '1fea8e64-2626-36ab-b0fa-2a7cd2f36d59'
  })
}).then(response => response.json());
*/

const Marker = ({ children }) => children;

export default function App() {

  // 1) map setup
  const mapRef = useRef();
  const [zoom, setZoom] = useState(13);
  const [bounds, setBounds] = useState(null);
  const [angle, setAngle] = useState();

  // 2) load and format data
  const [token, setToken] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const timer = setInterval(() => {
      async function getToken(url = "", data = {}) {
        const response = await fetch("https://api.vasttrafik.se/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + process.env.REACT_APP_TOKEN_CREDENTIALS
          },
          body: "grant_type=client_credentials&scope=d1"
        });
        return response.json();
      }

      getToken(
        "https://api.vasttrafik.se/token",
        "grant_type=client_credentials&scope=d1"
      ).then((data) => {
        setToken(data.access_token);
      });

      async function getData(url = "", data = {}) {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      if (token) {
        getData(
          process.env.REACT_APP_API_URL
        ).then((data) => {
          setData(data);
        });
      }
    }, 1000);
  }, [token]);


  const vehicles = data != null ? data.livemap.vehicles.slice(0, 20) : [];
  console.log(vehicles)
  // 3) get clusters

  // 4) render map


  return (<div style={{ height: '100vh', width: '100%' }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
      defaultCenter={{ lat: 57.70716, lng: 11.96679 }}
      defaultZoom={13}
    >
      {vehicles.map(vehicle => (

        <Marker key={vehicle.gid} lat={parseFloat(vehicle.y) / 1000000.00} lng={parseFloat(vehicle.x) / 1000000.00} >
          <button className='vehicle-marker' >
            {vehicle.name}
            <img className="car" src="./car-svgrepo-com.svg" alt="BUS" />
          </button>
        </Marker>
      ))}
    </GoogleMapReact>
  </div>

  );
}


