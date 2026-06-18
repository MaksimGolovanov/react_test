import React, { useState, useEffect } from 'react';
import {
  pdf,
  Document,
  Page,
  View,
  Text as PdfText,
  StyleSheet,
  Image as PdfImage,
  Font,
} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import {
  Button,
  Table,
  Row,
  Col,
  Spin,
  Select,
  Input,
  Space,
  Typography,
  Flex,
  Checkbox,
  message,
  theme,
} from 'antd';
import { FilePdfOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import BadgesService from '../services/BadgesService';
import styles from './style.module.css';
import logoImage from './logo.jpg';
import HeliosCondC_ from '../fonts/helioscondc.ttf';

const { Text } = Typography;
const { Option } = Select;
const { useToken } = theme;
const API_URL = process.env.REACT_APP_API_URL;

Font.register({
  family: 'HeliosCondC',
  src: HeliosCondC_,
});

const pdfStyles = StyleSheet.create({
  page: { padding: '15mm', fontFamily: 'HeliosCondC' },
  pageContent: { flexDirection: 'column' },
  pairContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  badgeContainer: { width: '90mm', height: '57mm', border: '1px solid rgb(199, 199, 199)' },
  photoContainer: { width: '30mm', height: '40mm', border: '1px solid #ccc', margin: '2mm' },
  photoImage: { width: '100%', height: '100%', objectFit: 'cover' },
  header: { width: '100%', height: '15mm', backgroundColor: '#003366', color: 'white', flexDirection: 'row', alignItems: 'center' },
  logo: { height: '15mm', width: 'auto' },
  companyName: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  nameSection: { width: '100%', height: '27mm', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2mm' },
  footer: { width: '100%', height: '15mm', backgroundColor: '#0079C2', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2mm', position: 'absolute', bottom: 0 },
  position: { fontSize: 12, textAlign: 'center', width: '100%' },
  safetyOfficer: { fontSize: 10, color: '#FFD700', textAlign: 'center', width: '100%', marginTop: 2 },
  lastName: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  firstName: { fontSize: 18, fontWeight: 'normal' },
});

const BadgePDF = ({ badges, getDepartmentById, getDolgnostByCode }) => {
  const itemsPerPage = 4;
  const splitName = (fio) => {
    const parts = fio.split(' ');
    return { lastName: parts[0], firstName: parts.slice(1).join(' ') };
  };
  return (
    <Document>
      {Array.from({ length: Math.ceil(badges.length / itemsPerPage) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.pageContent}>
            {badges.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((badge, idx) => {
              const { lastName, firstName } = splitName(badge.fio);
              return (
                <View key={idx} style={pdfStyles.pairContainer}>
                  <View style={pdfStyles.badgeContainer}>
                    <View style={pdfStyles.header}>
                      <PdfImage src={logoImage} style={pdfStyles.logo} />
                      <PdfText style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</PdfText>
                    </View>
                    <View style={pdfStyles.nameSection}>
                      <PdfText style={pdfStyles.lastName}>{lastName}</PdfText>
                      <PdfText style={pdfStyles.firstName}>{firstName}</PdfText>
                    </View>
                    <View style={pdfStyles.footer}>
                      <PdfText style={pdfStyles.position}>
                        {`${getDolgnostByCode(badge.post)}, ${getDepartmentById(badge.department)}`}
                      </PdfText>
                      {badge.isSafetyOfficer && <PdfText style={pdfStyles.safetyOfficer}>Уполномоченный по ОТ</PdfText>}
                    </View>
                  </View>
                  <View style={pdfStyles.badgeContainer}>
                    <View style={pdfStyles.header}>
                      <PdfImage src={logoImage} style={pdfStyles.logo} />
                      <PdfText style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</PdfText>
                    </View>
                    <View style={pdfStyles.nameSection}>
                      <PdfText style={pdfStyles.lastName}>{lastName}</PdfText>
                      <PdfText style={pdfStyles.firstName}>{firstName}</PdfText>
                    </View>
                    <View style={pdfStyles.footer}>
                      <PdfText style={pdfStyles.position}>
                        {`${getDolgnostByCode(badge.post)}, ${getDepartmentById(badge.department)}`}
                      </PdfText>
                      {badge.isSafetyOfficer && <PdfText style={pdfStyles.safetyOfficer}>Уполномоченный по ОТ</PdfText>}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};

const PhotoPDF = ({ badges }) => {
  const itemsPerPage = 30;
  return (
    <Document>
      {Array.from({ length: Math.ceil(badges.length / itemsPerPage) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: '10mm' }}>
            {badges.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((badge, idx) => (
              <View key={idx} style={pdfStyles.photoContainer}>
                <PdfImage src={`${API_URL}static/photo/${badge.tabNumber}.jpg`} style={pdfStyles.photoImage} />
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

function BadgePage() {
  const { token } = useToken();
  const [staffList, setStaffList] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [dolgnostList, setDolgnostList] = useState([]);
  const [photoStatus, setPhotoStatus] = useState({});
  const [outputType, setOutputType] = useState('badges');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [departmentsData, dolgnostData] = await Promise.all([
          BadgesService.fetchAllDepartments(),
          BadgesService.fetchAllDolgnost(),
        ]);
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        setDolgnostList(Array.isArray(dolgnostData) ? dolgnostData : []);
      } catch (error) {
        console.error(error);
        message.error('Ошибка загрузки справочников');
      }
    };
    fetchInitialData();
  }, []);

  const getDolgnostByCode = (code) => {
    if (!dolgnostList || !Array.isArray(dolgnostList)) return code;
    const dolgnost = dolgnostList.find((d) => d.dolgn === code);
    return dolgnost ? dolgnost.dolgn_s : code;
  };

  const getDepartmentById = (id) => {
    if (id === null || id === undefined) return null;
    if (!departments || !Array.isArray(departments)) return id;
    const departmentCode = String(id).split(' ')[0];
    const foundDepartment = departments.find((d) => d.code === departmentCode) || departments.find((d) => d.code === id);
    return foundDepartment ? foundDepartment.short_name : null;
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const fetchedStaff = await BadgesService.fetchStaff();
        setStaffList(fetchedStaff);
        fetchedStaff.forEach((staff) => checkPhotoExists(staff.tabNumber));
      } catch (error) {
        console.error('Error fetching staff:', error);
        message.error('Ошибка загрузки списка сотрудников');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const checkPhotoExists = (tabNumber) => {
    if (!tabNumber) return;
    setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'loading' }));
    const img = new Image();
    img.src = `${API_URL}static/photo/${tabNumber}.jpg?t=${Date.now()}`;
    img.onload = () => {
      if (img.width > 0) setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'photo' }));
      else setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'error' }));
    };
    img.onerror = () => setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'error' }));
  };

  const handleAddBadge = (staffMember) => {
    const newBadge = {
      ...staffMember,
      uid: Date.now() + Math.random(),
      isSafetyOfficer: false,
    };
    setSelectedBadges([...selectedBadges, newBadge]);
    message.success(`Добавлен: ${staffMember.fio}`);
  };

  const handleRemoveBadge = (uid) => {
    setSelectedBadges(selectedBadges.filter((b) => b.uid !== uid));
  };

  const handleToggleSafetyOfficer = (uid, checked) => {
    setSelectedBadges(selectedBadges.map((b) => (b.uid === uid ? { ...b, isSafetyOfficer: checked } : b)));
  };

  const handleGeneratePDF = async () => {
    if (selectedBadges.length === 0) {
      message.warning('Добавьте сотрудников для генерации');
      return;
    }
    if (outputType === 'photos') {
      const hasPhotos = selectedBadges.some((badge) => photoStatus[badge.tabNumber] === 'photo');
      if (!hasPhotos) {
        message.warning('Нет доступных фото для выбранных сотрудников');
        return;
      }
    }
    const blob = await pdf(
      outputType === 'badges'
        ? <BadgePDF badges={selectedBadges} getDepartmentById={getDepartmentById} getDolgnostByCode={getDolgnostByCode} />
        : <PhotoPDF badges={selectedBadges.filter((badge) => photoStatus[badge.tabNumber] === 'photo')} />
    ).toBlob();
    saveAs(blob, `${outputType}_${new Date().toISOString().slice(0, 10)}.pdf`);
    message.success('PDF сформирован');
  };

  const filteredStaff = staffList.filter(
    (staffMember) =>
      staffMember.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staffMember.tabNumber.includes(searchQuery)
  );

  const staffColumns = [
    { title: 'ФИО', dataIndex: 'fio', key: 'fio', width: 185 },
    { title: 'Должность', dataIndex: 'post', key: 'post', render: (post) => getDolgnostByCode(post), width: 200 },
    {
      title: 'Фото',
      dataIndex: 'tabNumber',
      key: 'photo',
      width: 80,
      render: (tabNumber) => {
        const status = photoStatus[tabNumber];
        if (status === 'loading') return <Spin size="small" />;
        if (status === 'photo') return <Text type="success">Есть</Text>;
        return <Text type="secondary">Нет</Text>;
      },
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" icon={<PlusOutlined />} onClick={() => handleAddBadge(record)} size="small">
          Добавить
        </Button>
      ),
    },
  ];

  const selectedColumns = [
    {
      title: '',
      key: 'remove',
      width: 50,
      render: (_, record) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleRemoveBadge(record.uid)} size="small" />
      ),
    },
    { title: 'ФИО', dataIndex: 'fio', key: 'fio', width: 200 },
    { title: 'Должность', dataIndex: 'post', key: 'post', render: (post) => getDolgnostByCode(post), width: 200 },
    { title: 'Отдел', dataIndex: 'department', key: 'department', render: (dept) => getDepartmentById(dept) || '-', width: 200 },
    ...(outputType === 'badges'
      ? [{
          title: 'Уп. по ОТ',
          key: 'safetyOfficer',
          width: 100,
          render: (_, record) => (
            <Checkbox checked={record.isSafetyOfficer} onChange={(e) => handleToggleSafetyOfficer(record.uid, e.target.checked)} />
          ),
        }]
      : []),
  ];

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '100vh' }}>
        <Spin size="large" tip="Загрузка..." />
      </Flex>
    );
  }

  return (
    <div className={styles.container} >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Flex gap="middle" align="center" wrap="wrap">
          <Button type="primary" icon={<FilePdfOutlined />} onClick={handleGeneratePDF}>
            Выгрузить в PDF
          </Button>
          <Select value={outputType} onChange={setOutputType} style={{ width: 220 }}>
            <Option value="badges">Формировать бейджики</Option>
            <Option value="photos">Формировать фото 3×4</Option>
          </Select>
        </Flex>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {/* Блок "Сотрудники" */}
            <div className={styles.sectionCard} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
              <div className={styles.sectionTitle} style={{ borderBottomColor: token.colorBorder, color: token.colorText }}>
                Сотрудники
              </div>
              <Input.Search
                placeholder="Поиск по ФИО, должности, отделу, табельному номеру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ marginBottom: 16 }}
                prefix={<SearchOutlined />}
              />
              <div className={styles.scrollableContainer}>
                <Table
                  columns={staffColumns}
                  dataSource={filteredStaff}
                  rowKey="tabNumber"
                  size="small"
                  pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Всего: ${total}` }}
                  scroll={{ y: 400 }}
                />
              </div>
            </div>

            {/* Блок "Выбранные сотрудники" */}
            <div className={styles.sectionCard} style={{ marginTop: 16, background: token.colorBgContainer, borderColor: token.colorBorder }}>
              <div className={styles.sectionTitle} style={{ borderBottomColor: token.colorBorder, color: token.colorText }}>
                Выбранные сотрудники
              </div>
              <div className={styles.scrollableContainer}>
                <Table
                  columns={selectedColumns}
                  dataSource={selectedBadges}
                  rowKey="uid"
                  size="small"
                  pagination={{ pageSize: 4, showSizeChanger: true }}
                  scroll={{ y: 300 }}
                  locale={{ emptyText: 'Нет выбранных сотрудников' }}
                />
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            {/* Блок "Предпросмотр" */}
            <div className={styles.sectionCard} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
              <div className={styles.sectionTitle} style={{ borderBottomColor: token.colorBorder, color: token.colorText }}>
                Предпросмотр
              </div>
              <div className={styles.previewContainer}>
                {outputType === 'badges' ? (
                  <Flex vertical gap={4} align="center">
                    {selectedBadges.map((badge) => (
                      <div key={badge.uid} className={styles.badgePair} style={{ borderBottomColor: token.colorBorder }}>
                        <div className={styles.badge} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
                          <div className={styles.badgeHeader} style={{ backgroundColor: '#003366', color: '#fff' }}>
                            <img src={logoImage} alt="Логотип" className={styles.badgeLogo} />
                            <div className={styles.badgeCompanyName} style={{ color: '#fff', fontSize: '14px' }}>Вуктыльское ЛПУМГ</div>
                          </div>
                          <div className={styles.badgeNameSection} style={{backgroundColor: '#fff'}}>
                            <div className={styles.badgeFullName} style={{ color: '#000', fontSize: '20px' }}>{badge.fio}</div>
                          </div>
                          <div className={styles.badgeFooter} style={{ backgroundColor: '#0079C2', color: '#fff', fontSize: '16px' }}>
                            <div>{`${getDolgnostByCode(badge.post)}, ${getDepartmentById(badge.department)}`}</div>
                            {badge.isSafetyOfficer && <div className={styles.safetyOfficer} style={{ color: '#FFD700' }}>Уполномоченный по ОТ</div>}
                          </div>
                        </div>
                        <div className={styles.badge} style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
                          <div className={styles.badgeHeader} style={{ backgroundColor: '#003366', color: '#fff' }}>
                            <img src={logoImage} alt="Логотип" className={styles.badgeLogo} />
                            <div className={styles.badgeCompanyName} style={{ color: '#fff', fontSize: '14px' }}>Вуктыльское ЛПУМГ</div>
                          </div>
                          <div className={styles.badgeNameSection} style={{backgroundColor: '#fff'}}>
                            <div className={styles.badgeFullName} style={{ color: '#000', fontSize: '20px' }}>{badge.fio}</div>
                          </div>
                          <div className={styles.badgeFooter} style={{ backgroundColor: '#0079C2', color: '#fff', fontSize: '16px' }}>
                            <div>{`${getDolgnostByCode(badge.post)}, ${getDepartmentById(badge.department)}`}</div>
                            {badge.isSafetyOfficer && <div className={styles.safetyOfficer} style={{ color: '#FFD700' }}>Уполномоченный по ОТ</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedBadges.length === 0 && <Text type="secondary">Выберите сотрудников для предпросмотра</Text>}
                  </Flex>
                ) : (
                  <Flex wrap="wrap" gap="small" justify="center">
                    {selectedBadges
                      .filter((badge) => photoStatus[badge.tabNumber] === 'photo')
                      .map((badge) => (
                        <div key={badge.uid} className={styles.photoItem} style={{ borderColor: token.colorBorder, background: token.colorBgLayout }}>
                          <img
                            src={`${API_URL}static/photo/${badge.tabNumber}.jpg`}
                            alt={badge.fio}
                            className={styles.photoImage}
                          />
                          <div className={styles.photoCaption} style={{ background: token.colorBgLayout, color: token.colorTextSecondary }}>
                            {badge.fio.split(' ')[0]}
                          </div>
                        </div>
                      ))}
                    {selectedBadges.length > 0 && selectedBadges.filter((b) => photoStatus[b.tabNumber] === 'photo').length === 0 && (
                      <Text type="secondary">Нет фото для выбранных сотрудников</Text>
                    )}
                  </Flex>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

export default BadgePage;