function Lights() {
  return (
    <>
      <ambientLight args={[0xffffff]} intensity={0.1} />
      <pointLight args={[0xffffff]} intensity={0.2} position={[0, 9, 10]} />
    </>
  );
}

export default Lights;
