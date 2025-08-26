
import React, { useEffect, useMemo, useState } from 'react';
import { API_BASE } from './config';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function App(){
  const [era, setEra] = useState('before');
  const [places, setPlaces] = useState([]);
  const [tips, setTips] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/places?era=${era}`).then(r=>r.json()).then(setPlaces);
    fetch(`${API_BASE}/api/tips?era=${era}`).then(r=>r.json()).then(setTips);
    fetch(`${API_BASE}/api/timeline`).then(r=>r.json()).then(setTimeline);
  }, [era]);

  const center = useMemo(()=>[31.52, 34.46],[]);

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Gaza Travel</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#map">Map</a>
          <a href="#timeline">Timeline</a>
          <a href="#tips">Tips</a>
        </nav>
      </header>

      <section id="home" className="hero">
        <span className="badge">Graduation Project</span>
        <h1>Tourism & Travel to Gaza — <span style={{color:'#60a5fa'}}>{era.toUpperCase()}</span></h1>
        <p>Explore places, stories, and responsible travel guidance <em>before</em> and <em>after</em> the war.</p>
        <div style={{marginTop:12}}>
          <select value={era} onChange={e=>setEra(e.target.value)} className="select">
            <option value="before">Before</option>
            <option value="after">After</option>
          </select>
        </div>
      </section>

      <section className="row">
        <div className="card">
          <h3>Places</h3>
          <table className="table">
            <thead><tr><th>Name</th><th>Description</th></tr></thead>
            <tbody>
              {places.map(p=>(
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Tips</h3>
          <ul>
            {tips.map(t=>(
              <li key={t.id} style={{marginBottom:8}}>
                <strong>{t.title}:</strong> {t.content}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="map" className="card" style={{marginTop:20}}>
        <h3>Map</h3>
        <div className="map">
          <MapContainer center={center} zoom={12} style={{height:'100%', width:'100%'}}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map(p => (
              <Marker key={p.id} position={[p.latitude, p.longitude]} icon={markerIcon}>
                <Popup>
                  <strong>{p.name}</strong><br/>
                  <span>{p.description}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      <section id="timeline" className="card" style={{marginTop:20}}>
        <h3>Timeline</h3>
        <ul>
          {timeline.map(t=>(
            <li key={t.id} style={{marginBottom:10}}>
              <strong>{t.date} — {t.title}</strong><br/>
              <span style={{color:'#94a3b8'}}>{t.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <p>Replace demo data with your research. Respect safety, access, and humanitarian guidance.</p>
      </footer>
    </div>
  );
}
