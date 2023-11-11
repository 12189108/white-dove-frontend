import "vditor/dist/index.css";
import React, { useState, useEffect } from 'react';
import Vditor from "vditor";
import { Layout, Input, Button, message } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import axiosInstance from '../axiosInstance'; // 导入配置好的axios实例
import { useNavigate, useLocation } from 'react-router-dom'; // 引入路由

const { Content } = Layout;

const inputStyle = {
  fontWeight: "bold",
  marginRight: "20px",
};

const titleStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "90%",
  margin: "0 auto",
  marginTop: "50px",
};

const vditorStyle = {
  margin: "0 auto",
  marginTop: "25px",
  minHeight: "500px",
};

const Vditor_editor = () => {
  const [blogName, setBlogName] = useState(localStorage.getItem('blogName') || 'Default Blog Name');

  // 从 localStorage 中读取 blogName

  // 当 localStorage 中的 blogName 更新时，更新 blogName 的状态
  useEffect(() => {
    const handleStorageChange = () => {
      setBlogName(localStorage.getItem('blogName'));
    };

    window.addEventListener('storage', handleStorageChange);

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.title = `${blogName} - 新建文章`;
  }, []);
  const navigate = useNavigate(); // 获取路由导航
  const [vd, setVd] = React.useState(null);
  React.useEffect(() => {
    const vditor = new Vditor("vditor", {
      toolbar: ["emoji", "headings", "bold", "italic", "strike", "link",
        "|", "list", "ordered-list", "check", "outdent", "indent", "|",
        "quote", "line", "code", "inline-code", "insert-before", "insert-after",
        "|", "table", "|", "undo", "redo", "|", "fullscreen", "edit-mode",
        {
          name: "more",
          toolbar: [
            "both", "code-theme", "content-theme", "export", "outline",
            "preview", "devtools", "info", "help",
          ],
        },
      ],
      minHeight: "500px",
      placeholder: "就在此处，开始创作",
      icon: "ant",
      width: "90%",
      max: 10000,
      after: () => {
        setVd(vditor);
      }
    });
  }, []);

  const [title, setTitle] = useState('');
  const author = localStorage.getItem('userName');
  const publishArticle = (title, content, author) => {
    axiosInstance.post('/articles/create_article', { title, content })
      .then(response => {
        console.log('Success:', response.data);
        if (response.data.message === 'Article created') {
          message.success('发布成功');
          navigate('/');
        } else {
          message.error('发布失败');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        message.error(error.response.data.detail);
      });
  }

  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem('vditorvditor');//避免编辑器残留内容
  }, [location]);


  return (
    < Content>
      <div style={titleStyle}>
        <Input placeholder="请输入标题" style={inputStyle} onChange={e => setTitle(e.target.value)} />
        <Button type="primary" icon={<ThunderboltOutlined />}
          onClick={() => publishArticle(title, vd.getValue(), author)} >
          发布文章
        </Button>
      </div>
      <div id="vditor" className="vditor" style={vditorStyle} />
    </Content >
  );
};

export default Vditor_editor;