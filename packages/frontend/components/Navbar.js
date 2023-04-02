import * as React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar sticky top-0 z-50 bg-[#0B090A] drop-shadow-md text-base-100 pr-6">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl ml-1.5 pl-2 pr-2">
          {/* <svg className="mr-2" width="22px" height="22px" viewBox="0 0 22 22" fill="#FFFFFF" stroke="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.875 13.75h0.515v0.688c0 0.379 0.308 0.688 0.688 0.688h1.719c0.379 0 0.688 -0.308 0.688 -0.688v-0.688h0.515c0.759 0 1.375 -0.616 1.375 -1.375V2.75c0 -0.759 -0.616 -1.375 -1.375 -1.375V0.688c0 -0.379 -0.308 -0.688 -0.688 -0.688h-2.75c-0.379 0 -0.688 0.308 -0.688 0.688v0.688c-0.759 0 -1.375 0.616 -1.375 1.375v9.625c0 0.759 0.616 1.375 1.375 1.375zm13.063 5.5h-0.056C21.194 17.789 22 15.865 22 13.75c0 -4.549 -3.701 -8.25 -8.25 -8.25v2.75c3.033 0 5.5 2.467 5.5 5.5s-2.467 5.5 -5.5 5.5H2.063c-1.139 0 -2.063 0.923 -2.063 2.063 0 0.379 0.308 0.688 0.688 0.688h20.625c0.379 0 0.688 -0.308 0.688 -0.688 0 -1.139 -0.923 -2.063 -2.063 -2.063zm-15.469 -1.375h8.938c0.19 0 0.344 -0.154 0.344 -0.344v-0.688c0 -0.19 -0.154 -0.344 -0.344 -0.344H4.469c-0.19 0 -0.344 0.154 -0.344 0.344v0.688c0 0.19 0.154 0.344 0.344 0.344z"/></svg> */}
          <Link href={"/"}>
          Graph-Funder
          </Link>
        </a>
      </div>
      <div className="navbar-end">
        <ul className="menu-horizontal p-0 pr-3 font-semibold uppercase focus:bg-none">
          {/* <li className="btn bg-transparent rounded-lg border-transparent">
            <Link href={"/explore"}>
              Explore
            </Link>
          </li> */}
          <li className="btn bg-transparent rounded-lg border-transparent">
            <Link href={"/publish"}>
              Publish
            </Link>
          </li>
        </ul>
        <ConnectButton />
      </div>
    </div>
  )
}

export default Navbar;

