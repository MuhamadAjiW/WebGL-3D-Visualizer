import { Loader } from "@/libs/class/loader/loader";

const fetchData = async () => {
  const response = await fetch("/scene.json");
  const data = await response.json();

  const loader: Loader = new Loader();
  return loader.loadFromJson(JSON.stringify(data));
};

export default fetchData