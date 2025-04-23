import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const footerContent = `${new Date().getFullYear()}  Crazy Test 体验技术部出品 `;
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={footerContent}
      links={
        [
          // {
          //   key: 'Crazy Test',
          //   title: 'Crazy Test',
          //   href: '',
          //   blankTarget: true,
          // },
          // {
          //   key: 'github',
          //   title: <GithubOutlined />,
          //   href: 'https://github.com/ant-design/ant-design-pro',
          //   blankTarget: true,
          // },
          // {
          //   key: 'Ant Design',
          //   title: 'Ant Design',
          //   href: 'https://ant.design',
          //   blankTarget: true,
          // },
        ]
      }
    />
  );
};

export default Footer;
