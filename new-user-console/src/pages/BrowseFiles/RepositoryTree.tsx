import React, {forwardRef, ReactNode} from "react";
import {Doc, Folders } from "@hitachivantara/uikit-react-icons";
import {HvLoading, HvPanel, HvTreeItem, HvTreeView } from "@hitachivantara/uikit-react-core";
import { css } from "@emotion/css";
import useBrowseFiles, {PentahoFile} from "./useBrowseFiles";

interface PentahoTreeItemProps {
  file: PentahoFile;
  onClick?: (file: PentahoFile) => void;
  children?: ReactNode;
}

interface RepositoryTreeProps {
  onTreeItemClick: (file: PentahoFile) => void;
}

const PentahoTreeItem = forwardRef<HTMLLIElement, PentahoTreeItemProps>(
  (props, ref) => {
    const {
      file,
      children,
      onClick,
    } = props;
    const Icon = file.folder ? Folders : Doc;

    return (
      <HvTreeItem
        ref={ref}
        nodeId={file.objectId}

        label={
          <div className={css({ display: "flex", alignItems: "center" })}>
            <Icon />
            <span
              onClick={() => {
                onClick?.(file);
                console.log("changing file to", file.path);
              }}
              style={{ flex: 1 }}
            >{file.title || file.name}</span>
          </div>
        }

      >
        {children}
      </HvTreeItem>
    );
  },
);

// @ts-ignore
const renderItem = ({ file, children, onTreeItemClick }) => (
  <PentahoTreeItem key={file.objectId} file={file} onClick={onTreeItemClick}>
    {children
      // @ts-ignore
      // ?.filter(({ path }) => path?.endsWith(".xanalyzer"))
      ?.map((data) => renderItem({ ...data, onTreeItemClick }))}
  </PentahoTreeItem>
);


export default ({
  onTreeItemClick,
}: RepositoryTreeProps) => {
  const { data, isLoading } = useBrowseFiles();

  if (data == null || isLoading) {
    return <HvLoading/>;
  }

  return (
    <HvPanel style={{ width: 300 }}>
      <HvTreeView aria-label="repository navigator">
        {renderItem({ ...data, onTreeItemClick })}
      </HvTreeView>
    </HvPanel>
  );
}
