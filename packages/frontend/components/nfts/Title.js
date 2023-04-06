const Title = ({ name }) => {
  return (
    <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
      {name || "..."}
    </h2>
  )
}

export default Title