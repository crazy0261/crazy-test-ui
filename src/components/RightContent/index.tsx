import { updateSelectProjectId } from '@/services/ant-design-pro/api';
import { Select } from 'antd';
import { useModel } from 'umi';

export type SiderTheme = 'light' | 'dark';

export const Question = () => {
  const { initialState } = useModel('@@initialState');
  const defaultProject = initialState?.currentUser?.selectProjectId;
  const projectList = initialState?.projectList?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));
  const handleOnChange = (e: any) => {
    updateSelectProjectId({ id: e });
    location.reload();
  };

  return (
    <div>
      项目：
      <Select
        defaultValue={defaultProject}
        style={{ width: 125 }}
        options={projectList}
        onChange={(e) => handleOnChange(e)}
      />
    </div>
  );
};
