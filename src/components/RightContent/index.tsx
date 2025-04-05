/*
 * @Author: Menghui
 * @Date: 2025-03-27 22:05:55
 * @LastEditTime: 2025-04-05 14:28:12
 * @Description:
 */
import { updateSelectProjectId } from '@/services/ant-design-pro/api';
import { Select } from 'antd';
import { useModel } from 'umi';

export type SiderTheme = 'light' | 'dark';

export const Question = () => {
  const { initialState } = useModel('@@initialState');
  const defaultProject = initialState?.currentUser?.selectProject;
  const projectList = initialState?.projectList?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  const handleOnChange = (e: any) => {
    updateSelectProjectId({ projectId: e.value }).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('Authorization', res.data);
        location.reload();
      }
    });
  };

  return (
    <div>
      项目：
      <Select
        defaultValue={defaultProject}
        style={{ width: 125 }}
        options={projectList}
        labelInValue
        onChange={(e) => handleOnChange(e)}
      />
    </div>
  );
};
