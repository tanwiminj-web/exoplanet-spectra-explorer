import { useState } from 'react';
import { planets } from './planetData';
import SpectrumChart from './SpectrumChart';

export default function App() {
  const [selectedIds, setSelectedIds] = useState(['wasp39b']);
  const [activeMolecule, setActiveMolecule] = useState(null);

  const togglePlanet = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.length === 1 ? prev : prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const activePlanets = planets.filter(p => selectedIds.includes(p.id));
  const allMolecules = activePlanets.flatMap(p => p.molecules);
  const uniqueMolecules = allMolecules.filter((m, i, arr) =>
    arr.findIndex(x => x.name === m.name && x.wavelength === m.wavelength) === i
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a3e, #0d0d1a)', borderBottom: '1px solid #2a2a4a', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>🔭</span>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#e2e8f0' }}>Exoplanet Atmosphere Explorer</h1>
          </div>
          <p style={{ margin: 0, color: '#8892a4', fontSize: 14 }}>
            Real JWST transmission spectra data — explore what molecules exist in exoplanet atmospheres
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Planet selector */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#8892a4', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Select planets to compare</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {planets.map(p => (
              <button
                key={p.id}
                onClick={() => togglePlanet(p.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: `2px solid ${selectedIds.includes(p.id) ? p.color : '#2a2a4a'}`,
                  background: selectedIds.includes(p.id) ? `${p.color}22` : '#1a1a2e',
                  color: selectedIds.includes(p.id) ? p.color : '#8892a4',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
              >
                {p.name}
                <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.8 }}>{p.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: '#111127', borderRadius: 12, border: '1px solid #2a2a4a', padding: '24px 16px', marginBottom: 28 }}>
          <h2 style={{ margin: '0 0 20px 16px', fontSize: 16, color: '#c4ccd8', fontWeight: 600 }}>
            Transmission Spectrum
          </h2>
          <SpectrumChart planets={planets} selectedIds={selectedIds} />
        </div>

        {/* Molecule legend */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#8892a4', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Detected molecules — click to learn more</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {uniqueMolecules.map((mol, i) => (
              <button
                key={i}
                onClick={() => setActiveMolecule(activeMolecule?.name === mol.name && activeMolecule?.wavelength === mol.wavelength ? null : mol)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `1px solid ${mol.color}`,
                  background: activeMolecule?.wavelength === mol.wavelength ? `${mol.color}33` : 'transparent',
                  color: mol.color,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {mol.name} @ {mol.wavelength}μm
              </button>
            ))}
          </div>
          {activeMolecule && (
            <div style={{ marginTop: 14, padding: '14px 18px', background: '#1a1a2e', borderRadius: 8, border: `1px solid ${activeMolecule.color}44`, maxWidth: 600 }}>
              <p style={{ margin: 0, color: '#c4ccd8', fontSize: 14, lineHeight: 1.6 }}>
                <span style={{ color: activeMolecule.color, fontWeight: 700 }}>{activeMolecule.name}</span> — {activeMolecule.description}
              </p>
            </div>
          )}
        </div>

        {/* Planet info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {activePlanets.map(p => (
            <div key={p.id} style={{ background: '#111127', borderRadius: 12, border: `1px solid ${p.color}44`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ margin: 0, color: p.color, fontSize: 17 }}>{p.name}</h3>
                <span style={{ fontSize: 11, color: '#8892a4', background: '#1a1a2e', padding: '3px 8px', borderRadius: 10 }}>{p.type}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: '#8892a4' }}>Distance</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#c4ccd8' }}>{p.distance}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: '#8892a4' }}>Temperature</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#c4ccd8' }}>{p.temperature}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#8892a4', lineHeight: 1.6 }}>{p.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ marginTop: 40, textAlign: 'center', color: '#4a5568', fontSize: 12 }}>
          Built with real JWST data for NASA Stardance Challenge 2026 · Data source: NASA/ESA/CSA JWST Early Release Science Program
        </p>
      </div>
    </div>
  );
}