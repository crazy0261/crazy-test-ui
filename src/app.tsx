import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import {
  listAll as listAllUser,
  currentUser as queryCurrentUser,
} from '@/services/ant-design-pro/api';
import { list as listAllApp } from '@/services/application';
import { listPage } from '@/services/project';
import { type Settings as LayoutSettings, WaterMark } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  projectList?: { value: number; label: string }[];
  appList?: { value: string | number; label: string }[];
  userList?: { value: number; label: string }[];
  envList?: { value: number; label: string }[];

  loading?: boolean;
  x: any;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchProjectList?: () => Promise<{ value: number; label: string }[]>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser(localStorage.getItem('account'));
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchUserList = async (): Promise<{ value: number; label: string }[] | undefined> => {
    try {
      const userList: { value: number; label: string }[] = [];
      await listAllUser({}).then((result) => {
        if (result.code === 200) {
          result.data.map((item: any) => userList.push({ value: item.id, label: item.name }));
        }
      });
      return userList;
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };

  const fetchProjectList = async () => {
    try {
      const projectList = await listPage({ current: 1, pageSize: 1000 });

      if (projectList?.data?.length > 0) {
        return projectList.data;
      }
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };

  const fetchAppList = async (): Promise<{ value: number; label: string }[] | undefined> => {
    try {
      const appList: { value: number; label: string }[] = [];
      const result = await listAllApp({ current: 1, pageSize: 1000 });
      if (result.code === 200) {
        result.data.map((item: any) => appList.push({ value: item.id, label: item.name }));
      }
      return appList;
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const userList = await fetchUserList();
    const projectList = await fetchProjectList();
    const appList = await fetchAppList();
    return {
      fetchUserInfo,
      currentUser,
      fetchProjectList,
      projectList,
      userList,
      appList,
      x: null,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    fetchProjectList,
    x: null,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => [<Question key="Question" />],
    avatarProps: {
      // src: initialState?.currentUser?.avatar, 头像
      src: '/user.png',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name ?? 'Crazy Test',
    },

    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          <WaterMark
            content={[
              `${initialState?.currentUser?.name ?? 'Crazy Test'}`,
              `${initialState?.currentUser?.email ?? ''}`,
            ]}
            fontColor="rgba(0, 0, 0, 0.1)"
          >
            {children}
          </WaterMark>
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
