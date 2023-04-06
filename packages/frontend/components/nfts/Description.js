const Description = ({ text }) => {
  return (
    <p className="text-base text-justify text-gray-700 md:text-lg">
      <span className="mb-2 font-semibold leading-5">
        Description:&nbsp;
      </span>
      {text || "..."}
      <br></br>
    </p>
  )
}

export default Description