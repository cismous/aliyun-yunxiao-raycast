import { ActionPanel, List, Action } from "@raycast/api";
import { IRepositoryListItem } from "@yuntoo/aliyun-codeup-open-api";
import { useEffect, useState } from "react";
import { useRepositoryList } from "./use-repository-list";

export default function Command() {
  const { loading, repositoryList, setViewed } = useRepositoryList();
  const [list, setList] = useState<IRepositoryListItem[]>(repositoryList);

  useEffect(() => {
    setList((prev) => (prev.length ? prev : repositoryList));
  }, [repositoryList]);

  return (
    <List
      isLoading={loading}
      searchBarPlaceholder="Search..."
      onSearchTextChange={(text) => {
        if (!text) {
          setList(repositoryList);
          return;
        }
        setList(repositoryList.filter((item) => item.pathWithNamespace.includes(text)));
      }}
    >
      {list.map((item) => {
        const title = item.nameWithNamespace.split("/").slice(1).join("/").trim();
        const { id, webUrl } = item;
        const repositoryUrl = `git@codeup.aliyun.com:${item.pathWithNamespace}.git`;
        const updateViewed = () => setViewed(id);
        return (
          <List.Item
            key={id}
            title={title}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser title="查看代码" url={webUrl} onOpen={updateViewed} />
                <Action.CopyToClipboard title="复制仓库链接" content={repositoryUrl} />
                <Action.OpenInBrowser title="查看流水线" url={`${webUrl}/pipeline`} onOpen={updateViewed} />
                <Action.OpenInBrowser title="查看分支" url={`${webUrl}/branches`} onOpen={updateViewed} />
                <Action.OpenInBrowser title="查看合并请求" url={`${webUrl}/changes`} onOpen={updateViewed} />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}
