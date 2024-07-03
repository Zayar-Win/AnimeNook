import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import ChatBackground from "../../assets/ChatBackground.png";
import DownArrow from "../../assets/DownArrow";

const Home = () => {
    const [activeFAQ, setActiveFAQ] = useState(null);
    return (
        <div className="bg-[#2A2A2A] text-white">
            <div className="flex items-center justify-between px-[70px] py-[30px]">
                <div>
                    <h1 className="uppercase font-bold text-xl">AnimeNook</h1>
                </div>
                <div>
                    <ul className="flex items-center gap-[50px] uppercase text-sm font-semibold">
                        <li>
                            <Link>Home</Link>
                        </li>
                        <li>
                            <Link>Pricing</Link>
                        </li>
                        <li>
                            <Link>Features</Link>
                        </li>
                        <li>
                            <Link>Help</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <Link className="border-2 border-white px-[30px] py-[12px] uppercase font-black text-sm">
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="px-[70px]">
                <div className="flex items-center px-[50px]">
                    <div className="basis-[45%] relative">
                        <h1 className="text-7xl w-[90%] font-extrabold">
                            Get Website To Post Anime And Manga
                        </h1>
                        <img
                            className="absolute top-[-20px] right-[50px] w-[50px]"
                            src="https://short.io/static/star-d38c032d63bee9674f56de0a6cb578e7.svg"
                            alt=""
                        />
                        <img
                            className="absolute top-[48%] w-[300px] left-[70px]"
                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDciIGhlaWdodD0iNTgiIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiNGRkQyNUYiIGQ9Im0yODIgNTcgMy45LS4yaC0uNWMxLjMtLjIgMi43LS4yIDQgMGgtLjVjNi41LS4xIDguNS4zIDE0LjIuMiAzIDAgNC42LS40IDgtLjMgNC4yLjIgOCAwIDEyIDBoLS40YzMuNC0uNSA4LjEtLjggMTUuOS0xIDEgMCAyLS4zIDMtLjRsNi45LS4zYzUuMS0uNCA5LjMtLjQgMTQuNy0xLjFsNC43LS42YTIzLjYgMjMuNiAwIDAgMCAzLjgtMSA1LjYgNS42IDAgMCAwIDEuNy0uOWwuMy0uMy4zLS40Yy4zLS41LjUtMS4xLjUtMS44YTQuOCA0LjggMCAwIDAtLjMtMi4ydi0uM2wtLjMtLjQtLjctLjhhNiA2IDAgMCAwLTEtLjdjLS40LS4zLTEtLjUtMS41LS43bC0yLjktMWMtMS44LS42LTMuNy0xLTUuNi0xLjUtMy0uNi01LjUtMS4yLTctMS43bC40LjFjLTcuMi0xLjYtMTUuMS0yLjktMjIuNi00LTguNC0xLjUtMTUuNS0yLjMtMjIuNi0zLjItNS42LS44LTktMS42LTE1LjctMi40LTYtLjYtMTEtLjktMTguOC0xLjlsLTEzLjMtMi0xMi43LTEuOGMtMy44LS41LTUuOC0uNy03LjctLjctMy41IDAtNy0uNC0xMC42LTFsLTcuMS0xYy0zLjktLjMtNi42LS40LTEwLjMtLjgtNC42LS40LTEwLjQtMS0xNC45LTEuNmEzNjYgMzY2IDAgMCAwLTE3LjgtMmwtOC42LS44LTYuNy0xLjJjLTEuOS0uNS04LTEuMy0xMi42LTItMy43LS41LTYuOC0uOC0xMC4zLTFsLTUuOC0uOC03LjMtLjYtOS0xLjItMTYtMS4yYy00LjUtLjMtOC0uNC0xNC44LTEuMmwtOS0uOC04LjgtLjYtMTUuNy0xLjRjLTYuNC0uOS02LjQtLjgtMTEuNi0xLjRMMjYuOCAxLjNjLTIuNS4xLTcuNi0uMy0xNC42LTFMOCAwIDAgLjZjNi4yIDEgOC43IDEuOCAxNS45IDMgNi41IDEgMTIuNyAxLjkgMjMgMi45bDYgLjcgNC44LjhMNjMgOS4yYzExLjUgMSAyMy42IDIuMSAzMy4yIDIuNyAzLjYuMiA0IC4zIDEwLjcgMS4zIDUgLjcgNy45IDEuMiAxMC44IDEuOGwxNC4xIDEuNWM1LjggMSAxMy4zIDEuOCAyMi40IDIuNyA5LjYuOSAxNy41IDIgMjMgMyAwIDAtMS4yLjIuMi40IDUuMy44IDcuOSAxLjQgMTUuMSAyLjQgNi44LjcgMTQgMS41IDE4LjggMS43IDQgLjMgOC41LjcgMTMuNiAxLjNsOS4xIDFjNS45LjMgMTIuOCAxIDIxLjMgMi4yIDMgLjQgNi43LjkgOSAxbC0xLjUtLjIgMS4xLjJjMy40LjMgNi43LjYgMTAuNSAxLjNsNC40LjYgMjMuNSAzIDIuNC40YzYgLjUgMTIuNCAxLjMgMjEgMi43bDE5LjIgMy4yIDMuOS40LTEuNy0uMy44LjEuNS4yYzQuMy43IDguMyAxLjMgMTMgMi41YTI0OS43IDI0OS43IDAgMCAxIDguNSAyLjRsMS4xLjUuNS4zLjEtLjEuNC0uNmMwLS4yLjItLjMuMy0uMy4yLS4xLjEgMCAwLS4ybC0uNC0uNS0uMi0uMy0uMS0uMy0uMy4zLTEuMi40Yy0uOS4zLTEuOC41LTIuOS42LTQuNC44LTYuNyAxLjMtMTIgMS42LTMuNS0uMi03IDAtMTAuNS4zLTUuOS40LTYuNiAwLTkuMy4xYTkwNy44IDkwNy44IDAgMCAxLTI5LjIgMWgtMTVjLTMuNSAwLTYuOS0uMi04LjMtLjMtMi45LS40LTguNy0uNC0xNC4xLS40LTMuOCAwLTYuNC0uMS05LjMtLjNsLTEyLS40Yy0xMC40LS4yLTIwLjctLjItMzEuMS0uNmwtOS44LS4xaC03LjNjLTQuNS0uNi05LS44LTEzLjQtLjdsLTYuMi0uMmgtMy4zYy0yLjQtLjEtMy0uNC03LjItLjVoLTMuN2MtNS4yLjItMTEuNyAwLTE5LjYtLjQtOS0uNS0xOC0uOS0yNS44LTEtNiAwLTEyLjgtLjYtMTkuMS0uOS00LS42LTEyLjctMS0xOC0xLjctNi43LS4xLTEzLjUtLjUtMjEuNC0xLjQtMi43LS4zLTYtLjgtOC41LS44LTMgMC04LjItLjgtMTAuMy0uOUExMTUgMTE1IDAgMCAxIDI2IDM5LjFsLTIuNi0uNy0yLjItLjhhMTUuMyAxNS4zIDAgMCAxLTIuNS0xLjJ2LjNsLS40LjVjMCAuMy0uMi42LS40LjgtLjMuNC0uNC4yLS4yLjNsLjMuNC4zLjQuMi41LjMuNWE2OC40IDY4LjQgMCAwIDEgOC43LTIuN2w0LjctMWM2LjEtMSAxMS4xLTEuNSAxNi40LTIuMiA1LjctLjcgMTEuMS0xLjMgMTYtMS43bDIuNS0uM2MyLS4zIDQtLjYgNi4yLS43bDQuMi0uM2M5LjktLjggMjEtMi4xIDMwLjYtMi42IDkuNi0xIDIwLTEuNiAyOS43LTIuNmw5LS43IDMuOS0uM2M3LjcgMCAxNy0uNyAyNy43LTEuNWw2LjUtLjRjMi4zIDAgNC43LS4zIDctLjhsMS44LS4zYzYuOS0uNCA2LjgtLjQgMTMuNS0xbDE2LjYtMS4zYzctLjMgMTIuNi0uMyAyMC42LS43IDE2LjItLjkgMzAuNC0xLjIgNDUuMi0xLjUgNCAuMSA5LjgtLjEgMTUuMi0uM2w5LjgtLjQgMTgtLjVhNjQuMyA2NC4zIDAgMCAxIDExLjMuM2M1LjItLjEgMTAuNi0uMiAxNS42LS4xIDMtLjIgNi4xLS40IDkuNy0uNCAzLjYgMCA3LjggMCAxMi42LjdoLS40bDIgLjNhNi4xIDYuMSAwIDAgMSAxLjEuNGwuMi0uNC4zLS43Yy4xLS4zLjMtLjUuNS0uNmEuOC44IDAgMCAxLS40LS4zbC0uMS0uMi0uMy0uMy0uMS0uMy0uMi0uMnYtLjFsLS4yLjItMSAuNWMtLjYuNC0xLjQuNy0yLjIgMWE5NyA5NyAwIDAgMS0xMSAzLjJjMy41LTEgNS41LTEuNyA3LjYtMi41LTQuNSAxLjItOSAyLjEtMTMuNiAzYTM0MyAzNDMgMCAwIDEtOCAxLjljLTggMS41LTE0LjQgMi4zLTIwIDMtOC41LjgtOC44LjktMTguOCAyLjdsLTIuNy40LTEwLjEgMS4yLTQuNi42Yy02LjIgMS0xNC42IDEuOC0yMSAyLjZhMzM4IDMzOCAwIDAgMS0yNC4yIDIuMiAxMDEuNSAxMDEuNSAwIDAgMS0xMi42IDFjLTEuMi0uMy03LjMgMC0xMS44LjEtNC4yLjItOC41LjQtMTMuMS40LTMuOCAwLTcuMy4zLTkuOS41LTMuNC4zLTUuNCAwLTkuMyAwLTMuNC40LTEwLjIuNS0xNy41LjQtNC4zIDAtOC44LS4yLTEzLjMtLjRhNjUxIDY1MSAwIDAgMC0xNy4zLS41Yy02IDAtMTIuMy0uMi0xOC4zLS42bC0xNy0xLjctMTkuOS0yYTQ4My4zIDQ4My4zIDAgMCAxLTM4LjQtNS4zYy0yLjYtLjctNi43LTEuMy0xMS40LTIuMWwtMTEuMi0yLTYuOS0xLjJjLTItLjQtMi44LS40LTcuNy0xLjctMi4xLS43LTQuNS0xLjQtNy0yLjVsLTEuNy0uOS0uNy0uNWgtLjFzMC0uMSAwIDBMOSAxNmMtLjEuMy0uMy42LS42LjhsLjMuNC4yLjUuNC45LjItLjIuOS0uMiAyLS4yYTE2OC44IDE2OC44IDAgMCAxIDI0LjItMWM4IDAgMTUuNC4zIDIyLjguNyA1IC4yIDkuNy40IDEzLjcuMy43IDAgMy4zIDAgNC41LjIgNC40LjMgOC44LjUgMTMuMy42bDYuMi40IDcuNy41IDggLjFjNS41LjQgMTAuMi44IDE1LjIgMSA1IC4yIDkuMSAwIDE0LjEuMyA2LjQuMyA3LjcgMCAxNCAuMyAzLjcuNSA4LjYgMSAxNS40IDEuNSA4IC42IDEzLjguNiAyMC43IDEgMi4xLjMgMy43LjYgNiAuNyA4LjYuNyAxNy41IDEuNCAyNiAxLjcgMy45LjEgOC4zLjMgMTMgLjcgOC40LjcgMTcuNyAxLjIgMjUgMmwxNC4yLjZjOC4yLjcgMTQuNyAxLjUgMjMuMyAxLjlsNC4yLjRjMTAuMSAxIDE5LjUgMS41IDI2LjcgMS42IDMuNiAwIDcuOS4zIDEyLjYuNmwxMS41IDEgNi45LjkgNC40LjQgMTYuMSAxLjIgOCAuNSA5LjIuOCA0LjgtLjNjLTMuNS0uNiAxLS41IDIuOS0uNi0zLjQtLjUtNy4yLTEtMTIuMS0xLjVsLTMuNS0uMi0xMC4zLS40Yy0zLjktLjQtNy40LS44LTEwLjYtMWwtMTIuNC0xLjFjLTcuOS0uNy0xNC40LTEuNS0yMy0yLjItMS40IDAtMi41LS4zLTMuOC0uNGwzLjQtLjItNS0uN2MtNS44LS42LTExLjQtMS40LTE5LjItMi0xMi42LTEtMjUuNC0yLTM4LjEtMi43bC0xMi42LS41Yy05LjctLjktOS43LS45LTE4LTEuMi02LjYtMS40LTcuMi0xLjUtMjEuNi0yLjlsLTEzLjgtLjRjLTUuMiAwLTEyLjMtLjctMTcuNC0uOGgtMTBjLTIuNyAwLTUuMiAwLTkuNy0uMy0yIDAtNC4xLS4zLTYuMS0uOGwtMi43LS42LTE1LjItMS0xMy4zLTEtMTEuNy0uNi0xMy4yLS43LTExLjQtLjZjLTUtLjItNy41LS42LTEyLS43bC0uNi4xLS40LjJjLTE2LS44LTE2LS44LTI2LS41aC0xLjRjLTEyLjQtLjUtMTIuNC0uNi0yNi42LS42bC04LjktLjJhNzMuNCA3My40IDAgMCAwLTExLjMuN0EzLjQgMy40IDAgMCAwIDYgMTZhNC4yIDQuMiAwIDAgMCAwIDEuMyA0LjggNC44IDAgMCAwIC41IDEuOGwuMi40LjQuNGMuNy42IDEuNCAxIDIuMiAxLjRhMjYuMiAyNi4yIDAgMCAwIDUgMkExNDYuMSAxNDYuMSAwIDAgMCAzMSAyNy43bDIuNi41YzQuNC41IDEyLjYgMS45IDE4LjQgMi42bDQuOC43YzkuNCAxLjUgMTguOCAyLjkgMjcuNyA0bDkuNS44YzguNSAxIDE1LjggMiAyNC40IDIuNSAyLjIgMC0uNi0uNSA1LjUgMGwxNS42IDEuNyAxMC4yLjhIMTY0YzcgLjQgMTMuNC43IDIwLjIuNyA4IC4zIDEzLjkgMCAxOS41LS4zIDUgMCA5IC4yIDEzLjEgMCA0LjkgMCA5LjktLjMgMTUuNy0uNiAxMS4zIDAgMjUtLjggMzguOS0xLjhsOS42LS43YzQuNi0uNCA0IDAgNy42LS4zIDMuMS0uNiA2LjItLjggOC45LTFsMTAtMS42YzEwLjEtMS40IDE4LjItMi45IDI4LjctNC42IDYuNS0xLjEgMTIuOS0yLjQgMTkuNC0zLjdsNS40LS44YTEzMi40IDEzMi40IDAgMCAwIDIyLjMtNmMuOC0uMiAxLjctLjcgMi41LTEuMmwuOC0uNmE0LjcgNC43IDAgMCAwIC43LTEuMWwuMS0uMi4xLS4zYTUuMSA1LjEgMCAwIDAgLjMtMS42bC0uMi0xLjQtLjYtMS4xLS4yLS4zLS4yLS4yLS4zLS4yYy0uMi0uMy0uNS0uNC0uOC0uNmExMyAxMyAwIDAgMC0yLjUtLjhsLTIuNC0uNC00LjktLjVjLTUuMS0uNC0yLjUtLjYtNi41LS45bC0zLjQtLjItOS41LjJjLTkuMi0uNS0yMC4xLS4xLTI5LjggMC00LjgtLjQtOS42LS40LTE0LjQtLjFsLTguMS4zaC00IC41bC00LjguMS0yNi42IDFjLTguMS4yLTE2LjUuNy0yMy40IDEuNC01LjIuNi0xMi42IDEtMTkuNCAxLjYtMy43LjMtNCAwLTYuOC4zbC0xNS42IDEuNCAyLjcuMi04LjkuNy04LjIuN2MtMTEuNy4yLTE2LjMuNC0yNy44IDEuMi03IC42LTExLjguOC0xNi44IDFsLTQuNS4yLTEyIDEuMi0xNi43IDFjLTMuNy4yLTYuNC41LTkgLjkgMS40IDAgNy4xLS42IDYuMS0uMi01LjMuNi0xMC4zIDEtMTQuNCAxLjEtMS40IDAtMi41IDAtNSAuMy01LjMuNi03LjcuNS0xMS40IDEtNC42LjUtNC4yLjgtOS43IDEuMy01LjYgMC01LjYgMC0xOC42IDEuM0w0MCAyOC4zYy00LjkuNi05LjcgMS40LTE0LjMgMi40YTQzLjggNDMuOCAwIDAgMC04LjcgM2wtLjYuNC0uNC40YTUuOCA1LjggMCAwIDAtLjggMS4yYy0uMS4zLS4zLjYtLjMgMWE2LjEgNi4xIDAgMCAwLS4xIDIuNSA0LjggNC44IDAgMCAwIDIuNSAzLjVsLjkuNCAxLjYuNWE3OS42IDc5LjYgMCAwIDAgMTYuOSAyLjZjMi4yIDAgNyAuNiAxMC44IDEgNS42LjggMTEuNCAxLjQgMTcuNyAxLjkgNi40LjUgOS42IDEgMTQuNiAxLjVIODRjNy4zLjMgOS4zLjQgMTguMyAxbDIuNy4yIDEyIC40YzYuNSAwIDEzIC4zIDIwIC44bDcuNy41YzUuMiAwIDEwIDAgMTcgLjRsNC44LjJjOC4yLjMgMTYgLjUgMTguNSAxbDEzLjUgMS4xIDUuMi4xIDE2LjYtLjFoMTcuM2wyLjguMmM0LjguNSA5LjYuNiAxNC40LjQgNyAuMSAxMy41LS4xIDIwLjguMWg2LjctLjN6TTcwLjkgNDlsMi42LjNjLjQgMCAuMi4xLS40IDBsLTYuNC0uMmMtMi4zLS41IDEuNi0uMiA0LjIgMHptMTQzLjQtMjMuMy40LjEtMS41LS4xaC0uMyAxLjR6bS0xODkgNS41aC0uNGwxLjQtLjJoLjNsLTEuMy4yeiIvPjxwYXRoIGZpbGw9IiNGRkQyNUYiIGQ9Ik0zNTUuNiAzOS43aC43bC0xLjEtLjFoLjR6TTI4NS40IDU3SDI4MmgzLjR6bTMuOSAwaC0zLjkuNXYtLjJoLS41IDQtLjV2LjJoLjR6bTMzLjQtLjNoMS41LTEuNXpNMzAwLjQgOS42aDEuMy0xLjcuNHptODAuOSA3LjEgMS40LjMtMS0uMmgtLjR6Ii8+PC9zdmc+"
                            alt=""
                        />
                        <p className="mt-[80px] w-[50%] leading-[1.8] text-[#868686] text-lg font-semibold">
                            Modern, personalize, and share fully branded own
                            website.
                        </p>
                        <button className="bg-white text-black mt-[20px] px-[30px] py-[12px] uppercase font-black text-sm">
                            Start For Free
                        </button>
                    </div>
                    <div className="basis-[55%]">
                        <img
                            className="w-full h-full"
                            src="https://short.io/static/hero-dark-80b593ef4062c08bb3a9ddfa8ecf841d.avif"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div className="px-[70px]">
                <div className="flex items-center px-[50px]">
                    <div className="basis-[50%]">
                        <img
                            src="https://short.io/static/d03c78145c9802e4805b332af3d8fee7/eacf1/integrations-dark.avif"
                            alt=""
                        />
                    </div>
                    <div className="basis-[50%]">
                        <h1 className="text-7xl font-black">
                            Make your work easier with us
                        </h1>
                        <p className="pt-[30px] mb-[70px] font-semibold leading-[1.8] text-[#C0C0C0]">
                            Animenook is designed to simplify the workflow of
                            businesses. Animenook binds internal operations to
                            the integrations to automate manual processes. While
                            you are engaged in advanced tasks, the integrations
                            work for you.
                        </p>
                        <button className="bg-white text-black mt-[20px] px-[30px] py-[12px] uppercase font-black text-sm">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-[70px] mt-[100px]">
                <div className="flex items-center px-[50px]">
                    <div className="basis-[25%]">
                        <img
                            src="https://short.io/static/644cee883ded284661d5f155ed0ce389/a2f3f/medium-01-dark.avif"
                            alt=""
                        />
                    </div>
                    <div className="basis-[50%]">
                        <div className="relative">
                            <h1 className="text-6xl text-center font-black">
                                Create personalized Website
                            </h1>
                            <img
                                className="absolute top-[30%] leading-[2.3] right-0 w-[400px]"
                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1ODgiIGhlaWdodD0iNTgiIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiNGRkQyNUYiIGQ9Im00MDcuMSA1NyA1LjctLjJoLS43YzItLjIgMy45LS4yIDUuOCAwaC0uN2M5LjQtLjEgMTIuMy4zIDIwLjQuMiA0LjQgMCA2LjctLjQgMTEuNS0uMyA2LjIuMiAxMS43IDAgMTcuNSAwaC0uNmM0LjgtLjUgMTEuNy0uOCAyMi45LTEgMS40IDAgMi45LS4zIDQuNC0uNGw5LjktLjNjNy41LS40IDEzLjQtLjQgMjEuMy0xLjFsNi43LS42YTQ4IDQ4IDAgMCAwIDctMS40IDYgNiAwIDAgMCAxLS41bC40LS4zLjQtLjRjLjQtLjUuNy0xLjEuOC0xLjhhMy40IDMuNCAwIDAgMC0uNC0yLjJsLS4xLS4zYTUuMiA1LjIgMCAwIDAtMS40LTEuMmwtMS40LS43LTIuMi0uN2ExNzEuNyAxNzEuNyAwIDAgMC0xMi4zLTIuNGMtNC4yLS43LTcuOS0xLjMtMTAuMS0xLjhsLjYuMWMtMTAuNS0xLjYtMjEuOS0yLjktMzIuNy00LTEyLjEtMS41LTIyLjMtMi4zLTMyLjUtMy4yLTguMi0uOC0xMy4yLTEuNi0yMi43LTIuNC04LjctLjYtMTYtLjktMjcuMS0xLjlsLTE5LjMtMi0xOC4zLTEuOGExMTkgMTE5IDAgMCAwLTExLjEtLjdjLTUuMSAwLTEwLjItLjQtMTUuMy0xbC0xMC40LTFjLTUuNS0uMy05LjQtLjQtMTQuOS0uOC02LjUtLjQtMTQuOS0xLTIxLjMtMS42LTkuMy0uOC0xNy4yLTEuNS0yNS44LTJsLTEyLjQtLjgtOS44LTEuMmMtMi42LS41LTExLjQtMS4zLTE4LjItMi01LjItLjUtOS43LS44LTE0LjgtMWwtOC40LS44LTEwLjQtLjYtMTMuMi0xLjItMjMtMS4yYy02LjUtLjMtMTEuNC0uNC0yMS4zLTEuMmwtMTMuMi0uOC0xMi42LS42LTIyLjYtMS40Yy05LjMtLjktOS4yLS44LTE2LjgtMS40TDM4LjcgMS4zYy0zLjYuMS0xMS0uMy0yMS0xTDExLjQgMCAwIC42YzkgMSAxMi41IDEuOCAyMyAzIDkuMyAxIDE4LjQgMS45IDMzIDIuOWw5IC43IDYuOC44IDE5IDEuMmMxNi42IDEgMzQuMSAyLjEgNDggMi43IDUuMS4yIDUuOC4zIDE1LjQgMS4zIDcuMy43IDExLjQgMS4yIDE1LjYgMS44bDIwLjQgMS41YzguNCAxIDE5LjIgMS44IDMyLjMgMi43IDEzLjkuOSAyNS4zIDIgMzMuMiAzIDAgMC0xLjcuMi4zLjQgNy43LjggMTEuNCAxLjQgMjEuOSAyLjQgOS43LjcgMjAgMS41IDI3IDEuNyA1LjguMyAxMi4zLjcgMTkuOCAxLjMgNSAuNCA5LjEuOCAxMy4xIDEgOC40LjMgMTguNSAxIDMwLjcgMi4yIDQuNC40IDkuNy45IDEzIDFsLTIuMS0uMiAxLjUuMmM1IC4zIDkuNy42IDE1LjIgMS4zbDYuMy42IDM0IDMgMy40LjRjOC43LjUgMTggMS4zIDMwLjMgMi43IDguNCAxIDE4LjMgMiAyNy44IDMuMmw1LjYuNC0yLjQtLjMgMSAuMS44LjJjNi4yLjcgMTIgMS4zIDE4LjggMi41YTQ5NC4zIDQ5NC4zIDAgMCAxIDEyLjQgMi40bDEuNS41LjYuM2guMWwuMi0uMWMuMS0uMy4zLS41LjUtLjZsLjQtLjNjLjMtLjEuMyAwIDAtLjJsLS41LS41LS4zLS4zYzAtLjItLjItLjMtLjItLjNhNDcuNCA0Ny40IDAgMCAxLTYuMyAxLjNjLTYuNC44LTkuNyAxLjMtMTcuMyAxLjYtNS4xLS4yLTEwLjIgMC0xNS4yLjMtOC41LjQtOS41IDAtMTMuNS4xYTE4ODkuNiAxODg5LjYgMCAwIDEtNDIuMSAxaC0yMS43Yy01IDAtOS45LS4yLTEyLS4zLTQuMS0uNC0xMi42LS40LTIwLjQtLjQtNS40IDAtOS4yLS4xLTEzLjMtLjNsLTE3LjUtLjRjLTE1LS4yLTI5LjgtLjItNDQuOC0uNmwtMTQuMi0uMWgtMTAuNGExOTEgMTkxIDAgMCAwLTE5LjQtLjdsLTktLjJoLTQuN2MtMy42LS4xLTQuMy0uNC0xMC41LS41SDIzOWMtNy41LjItMTcgMC0yOC40LS40LTEzLS41LTI1LjktLjktMzcuMi0xLTguOCAwLTE4LjUtLjYtMjcuNy0uOS01LjctLjYtMTguMy0xLTI1LjktMS43YTQyMSA0MjEgMCAwIDEtMzAuOS0xLjRjLTMuOC0uMy04LjYtLjgtMTIuMy0uOC00LjMgMC0xMS44LS44LTE0LjgtLjktNS40IDAtMTUtLjctMjQuMy0xLjhsLTMuNy0uNy0zLjItLjhhMjguMyAyOC4zIDAgMCAxLTMuNi0xLjJsLS4yLjNjMCAuMi0uMi40LS40LjUtLjEuMy0uMy42LS42LjgtLjQuNC0uNi4yLS4zLjNsLjUuNC4zLjQuNC41LjQuNSAxLjgtLjZjMy0uNyA2LjQtMS40IDEwLjktMi4xbDYuNy0xYzguOC0xIDE2LTEuNSAyMy43LTIuMiA4LjEtLjcgMTYtMS4zIDIzLTEuN2wzLjctLjNjMi43LS4zIDUuOC0uNiA4LjgtLjdsNi4yLS4zYzE0LjMtLjggMzAuNC0yLjEgNDQuMi0yLjYgMTMuOC0xIDI5LTEuNiA0Mi45LTIuNmwxMy0uNyA1LjUtLjNjMTEuMSAwIDI0LjctLjcgNDAtMS41bDkuNC0uNGE5MiA5MiAwIDAgMCAxMC4yLS44bDIuNi0uM2M5LjktLjQgOS43LS40IDE5LjQtMWwyNC0xLjNjMTAtLjMgMTguMy0uMyAyOS43LS43IDIzLjQtLjkgNDQtMS4yIDY1LjQtMS41IDUuNy4xIDE0LS4xIDIxLjgtLjNsMTQuMy0uNCAyNi0uNWExMzQgMTM0IDAgMCAxIDE2LjMuM2M3LjUtLjEgMTUuMy0uMiAyMi41LS4xIDQuMy0uMiA4LjgtLjQgMTQtLjQgNS4xIDAgMTEuMiAwIDE4LjEuN2gtLjZsMyAuM2ExMiAxMiAwIDAgMSAxLjYuNGwuMy0uNC40LS43Yy4yLS4zLjQtLjUuNy0uNmwtLjYtLjMtLjItLjJhMyAzIDAgMCAxLS4zLS4zbC0uMi0uMy0uMi0uMnYtLjFhNTI3LjMgNTI3LjMgMCAwIDEtNzAgMTAuMmMtMTIuMyAxLTEyLjcgMS0yNy4yIDIuOGwtMy44LjQtMTQuNiAxLjItNi42LjZjLTkgMS0yMSAxLjgtMzAuMiAyLjZhNjk5LjYgNjk5LjYgMCAwIDEtMzUuMSAyLjIgMjA5LjggMjA5LjggMCAwIDEtMTguMiAxYy0xLjctLjMtMTAuNiAwLTE3IC4xLTYuMS4yLTEyLjMuNC0xOSAuNC01LjQgMC0xMC42LjMtMTQuMi41LTUgLjMtNy44IDAtMTMuNCAwLTUgLjQtMTQuOC41LTI1LjQuNC02LjIgMC0xMi43LS4yLTE5LS40bC0yNS0uNWE3MjYgNzI2IDAgMCAxLTI2LjYtLjZsLTI0LjQtMS43LTI4LjgtMkE5OTUuNyA5OTUuNyAwIDAgMSA4MSAyNi4zYy0zLjktLjctOS44LTEuMy0xNi42LTIuMWwtMTYuMS0yLTEwLTEuMmMtMi44LS40LTQtLjQtMTEtMS43LTMuMi0uNy02LjctMS40LTEwLjItMi41bC0yLjUtLjktMS0uNWgtLjFzMC0uMSAwIDBsLS42LjZhMyAzIDAgMCAxLS44LjhIMTJhLjMuMyAwIDAgMSAuMiAwbC40LjQuMy41LjUuOS4zLS4yQTIwIDIwIDAgMCAxIDE4IDE4YTM1MS45IDM1MS45IDAgMCAxIDM1LTFjMTEuNiAwIDIyLjIuMyAzMi44LjcgNy4zLjIgMTQgLjQgMTkuOS4zYTExMDMuNCAxMTAzLjQgMCAwIDAgMjUuNy44bDkgLjQgMTEgLjUgMTEuNy4xYzcuOC40IDE0LjYuOCAyMS45IDEgNy4zLjIgMTMgMCAyMC4zLjMgOS4yLjMgMTEuMSAwIDIwIC4zIDUuNi41IDEyLjcgMSAyMi41IDEuNSAxMS42LjYgMTkuOS42IDI5LjggMSAzIC4zIDUuNC42IDguNi43IDEyLjUuNyAyNS4zIDEuNCAzNy43IDEuNyA1LjUuMSAxMiAuMyAxOC42LjcgMTIuMy43IDI1LjYgMS4yIDM2LjIgMmwyMC42LjZjMTEuNy43IDIxLjIgMS41IDMzLjUgMS45bDYuMS40YzE0LjYgMSAyOC4yIDEuNSAzOC42IDEuNiA1LjEgMCAxMS4zLjMgMTguMi42bDE2LjUgMSAxMCAuOSA2LjMuNCAyMy40IDEuMiAxMS42LjUgMTMuMi44IDctLjNjLTUtLjYgMS40LS41IDQuMS0uNi00LjktLjUtMTAuNC0xLTE3LjUtMS41bC01LS4yLTE0LjktLjRjLTUuNi0uNC0xMC43LS44LTE1LjMtMWwtMTcuOC0xLjFjLTExLjUtLjctMjAuOS0xLjUtMzMuNC0yLjItMiAwLTMuNS0uMy01LjQtLjRsNS0uMi03LjQtLjdjLTguMy0uNi0xNi40LTEuNC0yNy43LTItMTguMi0xLTM2LjUtMi01NS0yLjdsLTE4LjEtLjVjLTE0LjEtLjktMTQuMS0uOS0yNi0xLjItOS42LTEuNC0xMC40LTEuNS0zMS4zLTIuOWwtMjAtLjRjLTcuNCAwLTE3LjYtLjctMjUtLjhoLTE0LjVjLTMuOCAwLTcuNSAwLTE0LS4zLTMgMC01LjktLjMtOC43LS44bC00LS42YTk4MiA5ODIgMCAwIDEtMjEuOS0xbC0xOS4yLTEtMTYuOC0uNi0xOS4yLS43LTE2LjMtLjZjLTcuMy0uMi0xMS0uNi0xNy40LS43bC0uOS4xLS41LjJjLTIzLS44LTIzLS44LTM3LjYtLjVoLTJjLTE4LS41LTE4LS42LTM4LjUtLjZsLTEyLjgtLjJhMTUyLjkgMTUyLjkgMCAwIDAtMTYuNC43Yy0uOC4yLTEuNi42LTIuMyAxLjFsLS41LjVhMy44IDMuOCAwIDAgMC0uNyAxLjh2LjdhMy41IDMuNSAwIDAgMCAxLjIgMi4ybC42LjRjMSAuNiAyIDEgMyAxLjRhNDggNDggMCAwIDAgNy40IDIgMjg1IDI4NSAwIDAgMCAyMy44IDQuNWwzLjcuNWM2LjMuNSAxOC4yIDEuOSAyNi42IDIuNmw2LjkuN2MxMy41IDEuNSAyNyAyLjkgNDAgNGwxMy43LjhjMTIuMyAxIDIyLjggMiAzNS4yIDIuNSAzLjIgMC0uOC0uNSA4IDAgNy4zLjYgMTQuNSAxLjIgMjIuNSAxLjdsMTQuNy44aDIwLjdjMTAgLjQgMTkuNC43IDI5LjIuNyAxMS41LjMgMjAgMCAyOC0uMyA3LjQgMCAxMy4xLjIgMTkgMCA3IDAgMTQuMy0uMyAyMi43LS42IDE2LjMgMCAzNi0uOCA1Ni4xLTEuOGwxMy45LS43YzYuNi0uNCA1LjggMCAxMS0uMyA0LjUtLjYgOS0uOCAxMi44LTFsMTQuNC0xLjZjMTQuNy0xLjQgMjYuNC0yLjkgNDEuNS00LjYgOS40LTEuMSAxOC42LTIuNCAyOC0zLjdsNy44LS44YTI2NSAyNjUgMCAwIDAgMzIuMi02IDI1LjUgMjUuNSAwIDAgMCA0LjgtMS44IDUuNCA1LjQgMCAwIDAgMS0xLjFsLjItLjIuMi0uMy4yLS43LjEtMWEzLjYgMy42IDAgMCAwLTEuMi0yLjRsLS4zLS4zLS4xLS4yLS41LS4yYTI1LjMgMjUuMyAwIDAgMC00LjktMS4zbC0zLjMtLjUtNy4xLS41Yy03LjUtLjQtMy43LS42LTkuNS0uOWwtNC45LS4yLTEzLjYuMmMtMTMuNC0uNS0yOS4xLS4xLTQzIDAtNy0uNC0xMy45LS40LTIwLjgtLjFsLTExLjguM2gtNS43LjdsLTcgLjEtMzguMyAxYy0xMS44LjItMjMuOC43LTMzLjggMS40LTcuNi42LTE4LjIgMS0yOCAxLjYtNS40LjMtNS44IDAtMTAgLjNsLTIyLjQgMS40IDMuOC4yLTEyLjguNy0xMS43LjdjLTE3IC4yLTIzLjYuNC00MC4yIDEuMi0xMC4yLjYtMTcuMi44LTI0LjQgMWwtNi40LjItMTcuNSAxLjItMjQgMWMtNS4zLjItOS4yLjUtMTMgLjkgMi4xIDAgMTAuMy0uNiA4LjktLjItNy43LjYtMTUgMS0yMC44IDEuMS0yIDAtMy43IDAtNy4zLjMtNy42LjYtMTEgLjUtMTYuNSAxLTYuNS41LTYgLjgtMTMuOSAxLjMtOC4yIDAtOC4xIDAtMjcgMS4zbC0xMy45IDEuMmMtNyAuNi0xNCAxLjQtMjAuNyAyLjRhODUuNyA4NS43IDAgMCAwLTEyLjUgM2wtLjkuNC0uNi40YTYuNyA2LjcgMCAwIDAtMS4xIDEuMmwtLjUgMWE0LjQgNC40IDAgMCAwLS4xIDIuNWMuMyAxIC45IDEuOSAxLjcgMi41YTggOCAwIDAgMCAxLjkgMWwxLjMuNCAyLjQuNWExNjEuMyAxNjEuMyAwIDAgMCAyNC4zIDIuNmMzLjMgMCAxMC4xLjYgMTUuNyAxIDggLjggMTYuNCAxLjQgMjUuNiAxLjkgOS4xLjUgMTMuNyAxIDIxIDEuNWg2LjJjMTAuNS4zIDEzLjQuNCAyNi40IDFsNCAuMiAxNy4yLjRjOS41IDAgMTguOC4zIDI5IC44bDExIC41YzcuNiAwIDE0LjUgMCAyNC41LjRsNyAuMmMxMS44LjMgMjMuMi41IDI2LjggMWwxOS40IDEuMSA3LjUuMSAyNC0uMWgyNS4xbDQgLjJjNi45LjUgMTMuOC42IDIwLjguNCAxMCAuMSAxOS41LS4xIDMwIC4xaDkuNy0uNnptLTMwNC44LThhNjYuNiA2Ni42IDAgMCAxIDMuMy40bC05LjMtLjNjLTMuMy0uNSAyLjMtLjIgNiAwem0yMDctMjMuMy43LjEtMi4yLS4xaC0uNCAyek0zNi42IDMxLjJIMzZsMi0uMmguNGwtMS44LjJ6Ii8+PHBhdGggZmlsbD0iI0ZGRDI1RiIgZD0iTTUxMy41IDM5LjdoMWwtMS42LS4xaC42ek00MTIuMSA1N2gtNSA1em01LjcgMGgtNS43Ljh2LS4yaC0uOCA1LjgtLjd2LjJoLjZ6bTQ4LjItLjNoMi4xLTIuMXpNNDMzLjggOS42aDEuOS0yLjUuNnptMTE2LjcgNy4xIDIuMS4zLTEuNC0uMmgtLjd6Ii8+PC9zdmc+"
                                alt=""
                            />
                        </div>
                        <p className="py-[50px] text-2xl font-bold text-center">
                            And transfer links from one domain to another.
                        </p>
                        <div className="flex justify-center">
                            <button className="bg-white text-black px-[30px] py-[12px] uppercase font-black text-sm">
                                EXPLORE PRICING PLAN
                            </button>
                        </div>
                        <p className="mt-[30px] font-semibold text-center">
                            7-day free trial for paid plans & unlimited
                            redirects in each plan.
                        </p>
                    </div>
                    <div className="basis-[25%]">
                        <img
                            src="https://short.io/static/9e9c5ea80909c16b085032d4ace52fed/d19d9/medium-02-dark.avif"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div className="px-[70px] mt-[100px]">
                <div className="flex px-[50px] items-center">
                    <div className="basis-[40%]">
                        <img
                            className="mb-[60px] w-[100px]"
                            src="https://short.io/static/chat-8b5b6f04fb69dbe0a772f7d695503bbb.svg"
                            alt=""
                        />
                        <h1 className="text-6xl font-black">
                            Friendly support that cares
                        </h1>
                        <p className="py-[40px] font-medium">
                            We are always here for you and really care about
                            your success in using short links. So you always get
                            answers.
                        </p>
                        <p className="pt-[30px] text-lg font-semibold">
                            Get in touch from Monday to Friday to receive a
                            quick response.
                        </p>
                        <div className="flex items-center mt-[30px]">
                            <button className="bg-white border-2 border-transparent px-[30px] py-[12px] uppercase text-black font-black text-sm">
                                Chat Now
                            </button>
                            <button className="border-2 border-white px-[30px] py-[12px] uppercase font-black text-sm">
                                Send Mail
                            </button>
                        </div>
                    </div>
                    <div className="basis-[60%]">
                        <div className="relative pl-[70px]">
                            <img
                                className="w-full "
                                src={ChatBackground}
                                alt=""
                            />
                            <img
                                className="absolute w-[300px] top-[50%] left-[60%] translate-x-[-50%] translate-y-[-50%]"
                                src="https://short.io/static/85011b3503946de260c65b7d5d4e8206/f6628/support-worker-dark.avif"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[70px] mt-[100px] bg-[#383738]">
                <div className="px-[250px] py-[100px] relative">
                    <img
                        className="absolute w-[200px] left-0 top-[15%]"
                        src="https://short.io/static/medium-03-dark-ac6c807c37be4f5cf84137be0575ac9a.png"
                        alt=""
                    />
                    <img
                        className="absolute bottom-[15%] w-[250px] right-[-50px]"
                        src="https://short.io/static/medium-02-dark-15f9c233500faeac754842895de4a1dc.png"
                        alt=""
                    />
                    <div className="flex items-center justify-between">
                        <h1 className="text-6xl font-black">FAQ</h1>
                        <button className="border-2 border-white px-[30px] py-[12px] uppercase font-black text-sm">
                            VISIT HELP CENTER
                        </button>
                    </div>
                    <div className="flex flex-col gap-[30px] mt-[60px]">
                        <div
                            onClick={() =>
                                setActiveFAQ((prev) => (prev === 0 ? null : 0))
                            }
                            className={`bg-[#2A2A2A] ${
                                activeFAQ === 0 ? "h-[250px]" : "h-[110px]"
                            } px-[70px] py-[40px] overflow-hidden transition-all`}
                        >
                            <div className="flex  cursor-pointer items-center justify-between">
                                <p className="text-lg font-semibold">
                                    How To Buy A Domain
                                </p>
                                <DownArrow />
                            </div>
                            <p className="mt-[30px] leading-[1.9] text-sm font-bold">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Fuga minus temporibus sapiente
                                quis tempore at voluptatum dolore similique.
                                Totam molestiae saepe ullam suscipit. Distinctio
                                doloribus, culpa dolore deleniti excepturi
                                magnam.
                            </p>
                        </div>
                        <div
                            onClick={() =>
                                setActiveFAQ((prev) => (prev === 1 ? null : 1))
                            }
                            className={`bg-[#2A2A2A] ${
                                activeFAQ === 1 ? "h-[250px]" : "h-[110px]"
                            } px-[70px] py-[40px] overflow-hidden transition-all`}
                        >
                            <div className="flex  cursor-pointer items-center justify-between">
                                <p className="text-lg font-semibold">
                                    How To Buy A Domain
                                </p>
                                <DownArrow />
                            </div>
                            <p className="mt-[30px] leading-[1.9] text-sm font-bold">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Fuga minus temporibus sapiente
                                quis tempore at voluptatum dolore similique.
                                Totam molestiae saepe ullam suscipit. Distinctio
                                doloribus, culpa dolore deleniti excepturi
                                magnam.
                            </p>
                        </div>
                        <div
                            onClick={() =>
                                setActiveFAQ((prev) => (prev === 3 ? null : 3))
                            }
                            className={`bg-[#2A2A2A] ${
                                activeFAQ === 3 ? "h-[250px]" : "h-[110px]"
                            } px-[70px] py-[40px] overflow-hidden transition-all`}
                        >
                            <div className="flex  cursor-pointer items-center justify-between">
                                <p className="text-lg font-semibold">
                                    How To Buy A Domain
                                </p>
                                <DownArrow />
                            </div>
                            <p className="mt-[30px] leading-[1.9] text-sm font-bold">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Fuga minus temporibus sapiente
                                quis tempore at voluptatum dolore similique.
                                Totam molestiae saepe ullam suscipit. Distinctio
                                doloribus, culpa dolore deleniti excepturi
                                magnam.
                            </p>
                        </div>
                        <div
                            onClick={() =>
                                setActiveFAQ((prev) => (prev === 4 ? null : 4))
                            }
                            className={`bg-[#2A2A2A] ${
                                activeFAQ === 4 ? "h-[250px]" : "h-[110px]"
                            } px-[70px] py-[40px] overflow-hidden transition-all`}
                        >
                            <div className="flex  cursor-pointer items-center justify-between">
                                <p className="text-lg font-semibold">
                                    How To Buy A Domain
                                </p>
                                <DownArrow />
                            </div>
                            <p className="mt-[30px] leading-[1.9] text-sm font-bold">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Fuga minus temporibus sapiente
                                quis tempore at voluptatum dolore similique.
                                Totam molestiae saepe ullam suscipit. Distinctio
                                doloribus, culpa dolore deleniti excepturi
                                magnam.
                            </p>
                        </div>
                        <div
                            onClick={() =>
                                setActiveFAQ((prev) => (prev === 2 ? null : 2))
                            }
                            className={`bg-[#2A2A2A] ${
                                activeFAQ === 2 ? "h-[250px]" : "h-[110px]"
                            } px-[70px] py-[40px] overflow-hidden transition-all`}
                        >
                            <div className="flex  cursor-pointer items-center justify-between">
                                <p className="text-lg font-semibold">
                                    How To Buy A Domain
                                </p>
                                <DownArrow />
                            </div>
                            <p className="mt-[30px] leading-[1.9] text-sm font-bold">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Fuga minus temporibus sapiente
                                quis tempore at voluptatum dolore similique.
                                Totam molestiae saepe ullam suscipit. Distinctio
                                doloribus, culpa dolore deleniti excepturi
                                magnam.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[70px] pt-[100px] relative bg-[#383738]">
                <div className="py-[60px] flex flex-col items-center">
                    <img
                        className="absolute w-[350px] bottom-[20px] left-[50px]"
                        src="https://short.io/static/433f83e293bcc39501b67de9dd850269/19d4f/medium-05-dark.avif"
                        alt=""
                    />
                    <img
                        className="absolute w-[300px] bottom-[20px] right-[50px]"
                        src="https://short.io/static/09d857b577dd4e89ef4b8c72c98363b5/10c2b/medium-06-dark.avif"
                        alt=""
                    />
                    <h1 className="text-6xl font-black">
                        It's easy to get started
                    </h1>
                    <p className="py-[60px] text-2xl font-black">
                        And it's free — two things everyone loves.
                    </p>
                    <button className="bg-white text-black px-[30px] py-[15px] uppercase font-black text-sm">
                        Get Started
                    </button>
                </div>
            </div>
            <div className="px-[70px] mt-[100px]">
                <div className="px-[50px]">
                    <div className="grid grid-cols-6">
                        <div className="col-span-2">
                            <h1 className="text-2xl font-black">AnimeNook</h1>
                            <h1 className="text-3xl font-black mt-[40px]">
                                info@animenook.io
                            </h1>
                            <img
                                className="w-[150px] my-[40px]"
                                src="https://short.io/static/medium-footer-b20387b06981aa3b5fcadea07c170ef3.avif"
                                alt=""
                            />
                            <div className="flex items-center gap-[10px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Product</h1>
                            <ul className="flex text-sm font-black flex-col gap-[15px] mt-[30px]">
                                <li>
                                    <Link>Features</Link>
                                </li>
                                <li>
                                    <Link>Apps And Integration</Link>
                                </li>
                                <li>
                                    <Link>Pricing</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Resources</h1>
                            <ul className="flex text-sm font-black flex-col gap-[15px] mt-[30px]">
                                <li>
                                    <Link>API For Developer</Link>
                                </li>
                                <li>
                                    <Link>FAQ</Link>
                                </li>
                                <li>
                                    <Link>System Status</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">About us</h1>
                            <ul className="flex text-sm font-black flex-col gap-[15px] mt-[30px]">
                                <li>
                                    <Link>Our Team</Link>
                                </li>
                                <li>
                                    <Link>About Company</Link>
                                </li>
                                <li>
                                    <Link>Contact Us</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Community</h1>
                            <ul className="flex text-sm font-black flex-col gap-[15px] mt-[30px]">
                                <li>
                                    <Link>Blogs</Link>
                                </li>
                                <li>
                                    <Link>Help Center</Link>
                                </li>
                                <li>
                                    <Link>Resource Abuse</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="h-[0.4px] bg-white my-[30px]"></div>
                    <div className="flex justify-between items-center pb-[30px]">
                        <p className="text-[12px]">
                            © Copyright 2015-2024 Short.cm Inc. All Rights
                            Reserved.
                        </p>
                        <div className="flex gap-[30px] text-[12px]">
                            <p>Terms & Conditions</p>
                            <p>Privacy Policy and GDPR</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
