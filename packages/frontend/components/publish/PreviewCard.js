import { useEffect, useState } from "react";

const PreviewCard = (props) => {
  const [filePath, setFilePath] = useState("");
  const [imageTempURL, setImageTempURL] = useState("");

  useEffect(() => {
    if (filePath === "") return;
    setImageTempURL(window.URL.createObjectURL(filePath))
  }, [filePath])

  const ImageInputArea = () => {
    return (
      <div className="w-full flex justify-center items-center">
        <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-200 cursor-pointer">
          <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg width="155px" height="155px" fill="#A9A9A9" stroke="none" viewBox="0 0 155 155" xmlns="http://www.w3.org/2000/svg"><path d="M140.469 19.375H14.531C6.506 19.375 0 25.881 0 33.906v87.188c0 8.025 6.506 14.531 14.531 14.531h125.938c8.025 0 14.531 -6.506 14.531 -14.531V33.906c0 -8.025 -6.506 -14.531 -14.531 -14.531zm-1.817 101.719H16.348a1.817 1.817 0 0 1 -1.817 -1.817V35.723a1.817 1.817 0 0 1 1.817 -1.817h122.305a1.817 1.817 0 0 1 1.817 1.817v83.555a1.817 1.817 0 0 1 -1.817 1.817zM38.75 46.016c-6.687 0 -12.109 5.422 -12.109 12.109s5.422 12.109 12.109 12.109 12.109 -5.422 12.109 -12.109 -5.422 -12.109 -12.109 -12.109zM29.063 106.563h96.875v-24.219l-26.494 -26.494c-1.418 -1.418 -3.718 -1.418 -5.137 0L58.125 92.031l-11.963 -11.963c-1.418 -1.418 -3.718 -1.418 -5.137 0L29.063 92.031v14.531z"/></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold uppercase">Cover image</span></p>
              <p className="mb-2 text-sm text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">(SVG, PNG, JPG or GIF)</p>
          </div>
          <input 
            id="dropzone-file" 
            type="file"
            className="hidden" 
            accept="image/png, image/svg, image/jpeg, image/gif"
            onChange={event => {
              setFilePath(event.target.files[0]);
              props.setImage(event.target.files[0]);
            }}
          />
        </label>
      </div>
    )
  }

  const PrintCurrentDate = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentDay = currentDate.getDate()
    const options = { month: 'long'}
    const currentMonth = new Intl.DateTimeFormat('en-US', options).format(currentDate)
    const formatCurrentMonth = currentMonth.slice(0, 3).toUpperCase()

    return (
      <span className="text-gray-600">
        {` — ${currentDay} ${formatCurrentMonth} ${currentYear}`}
      </span>
    )
  }

  return ( 
    <div className="card w-96 bg-base-100 border border-black-100 shadow-xl">
       <figure className="h-full overflow-hidden">
        {imageTempURL === "" 
          ? <ImageInputArea />
          : <img width="384px" height="100px" src={imageTempURL} />
        }
      </figure>
      <div className="card-body">
        <a
          href="/"
          aria-label="Category"
          title="Visit the East"
          className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-purple-700"
        >
          {props.project}
        </a>
        <p className="mb-2 text-gray-700">
          {props.website}
        </p>
        {/* <a
          href="/"
          aria-label=""
          className="inline-flex items-center font-semibold transition-colors duration-200 text-gray-900 hover:text-purple-800"
        >
          Learn more
        </a> */}
      </div>
    </div>
  )
}

export default PreviewCard;