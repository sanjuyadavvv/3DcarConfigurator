// Ground.jsx
function Ground({ y = 0 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#151515" roughness={0.75} metalness={0.1} />
    </mesh>
  );
}
export default Ground;