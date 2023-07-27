export const Hero = () => {
    return (
        <div className="shadow-md h-full flex rounded-b-3xl justify-around bg-violet-200">
                <img className="rotate-90" src="/fruit.png" alt="" />
            <div className="md:h-1/2 z-20 mt-28 mb-16 text-center flex flex-col justify-center items-center w-5/6">
                <span className=" text-white uppercase font-bold text-7xl md:text-8xl">
                    Find <br /> Save <br /> Create
                </span>
                <p className="pt-4 text-2xl text-center md:text-3xl font-bold text-blue-950">YOUR FAVORITE SMOOTHIE RECIPES</p>
            </div>
                <img className="relative top-6 -rotate-90 z-10" src="/fruit.png" alt="" />
        </div>
    )
}