import Image from "next/image";
import Hello from "../Components/Hello";
import Link from "next/link";
import ItemsBtn from "@/Components/ItemsBtn";

const Home = () =>{
    return(
        <main>
            <Hello />
            <div className="text-5xl underline text-center">Makar myje auto na basenie</div>
            <br />
            <ItemsBtn/>
        </main>
    );
}

export default Home