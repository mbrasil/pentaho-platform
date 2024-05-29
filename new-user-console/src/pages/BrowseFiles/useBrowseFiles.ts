import {useCallback, useEffect, useState} from "react";
import useSWR from "swr";

export interface PentahoFile {
  objectId: string;
  name: string;
  title: string;
  path: string;
  folder: boolean;
}

export interface PentahoFileTree {
  file: PentahoFile,
  children: PentahoFileTree[];
}

export const HOST = import.meta.env.VITE_HOST ?? "";

export default () => {
  const [finalData, setFinalData] = useState<PentahoFileTree>();
  const fetcher = useCallback(async (url: string) => {
    try {
      const { children: [data] } = await fetch(url).then((res) => res.json());

      return data;
    } catch (ex) {
      console.error("error fetching repository tree", ex);
      window.location.href = `${HOST}/pentaho-ba-webapp/login.html`;
    }

    return null;
  }, [finalData]);

  const {
    data,
    isLoading,
    mutate
  } = useSWR(() => {
    const params = new URLSearchParams({
      depth: "0",
      showHidden: "false"
    });

    return `${HOST}/pentaho/plugin/scheduler-plugin/api/generic-files/tree?${params.toString()}`;
  }, fetcher);

  // Prevents data from updating to undefined when loading (this crashes useHvData)
  useEffect(() => {
    if (!isLoading && data) {
      setFinalData(data);
    }
  }, [isLoading, data]);

  return { data: finalData, isLoading, mutate };
};
