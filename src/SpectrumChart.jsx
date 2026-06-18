import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';

const MoleculeTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1e1e2e', border: '1px solid #444', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#aaa', margin: 0 }}>Wavelength: <b style={{ color: '#fff' }}>{payload[0].payload.wavelength} μm</b></p>
        <p style={{ color: '#aaa', margin: 0 }}>Transit Depth: <b style={{ color: '#fff' }}>{payload[0].value}%</b></p>
      </div>
    );
  }
  return null;
};

export default function SpectrumChart({ planets, selectedIds }) {
  const activePlanets = planets.filter(p => selectedIds.includes(p.id));
  const colors = activePlanets.map(p => p.color);

  // merge all wavelength points
  const allWavelengths = [...new Set(planets.flatMap(p => p.data.map(d => d.wavelength)))].sort((a, b) => a - b);

  const chartData = allWavelengths.map(wl => {
    const point = { wavelength: wl };
    activePlanets.forEach(p => {
      const match = p.data.find(d => d.wavelength === wl);
      if (match) point[p.id] = match.transitDepth;
    });
    return point;
  });

  // collect molecule markers from active planets
  const molecules = activePlanets.flatMap(p => p.molecules);
  const uniqueMolecules = molecules.filter((m, i, arr) => arr.findIndex(x => x.wavelength === m.wavelength && x.name === m.name) === i);

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="wavelength"
            label={{ value: 'Wavelength (μm)', position: 'insideBottom', offset: -5, fill: '#aaa' }}
            tick={{ fill: '#aaa' }}
            domain={[0.5, 5.2]}
          />
          <YAxis
            label={{ value: 'Transit Depth (%)', angle: -90, position: 'insideLeft', fill: '#aaa' }}
            tick={{ fill: '#aaa' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<MoleculeTooltip />} />
          <Legend wrapperStyle={{ color: '#ccc', paddingTop: 16 }} />
          {uniqueMolecules.map((mol, i) => (
            <ReferenceLine
              key={i}
              x={mol.wavelength}
              stroke={mol.color}
              strokeDasharray="4 4"
              label={{ value: mol.name, position: 'top', fill: mol.color, fontSize: 11 }}
            />
          ))}
          {activePlanets.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.id}
              name={p.name}
              stroke={p.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}