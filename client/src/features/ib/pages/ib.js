import React from "react";

import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const Ib = observer(() => {
  return (
    <div>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/instructions" style={{ textDecoration: "none", color: "blue" }}>
              Инструкция по работе с конфиденциальными документами
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/memo" style={{ textDecoration: "none", color: "blue" }}>
              Памятка пользователю по ИБ
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/secrets-list" style={{ textDecoration: "none", color: "blue" }}>
              Перечень информации составляющей коммерческую тайну и иной КИ
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
              Письмо СКЗ от 02_11_2020 СКЗ-14211
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            письмо СКЗ от 16_04_2019 43-686
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            письмо СКЗ от 17_07_2021 43-1352
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Политика обработки ПД в ГТУ приказ 727 от 31_07_2024
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Положение о порядке проведения служебных и внутренних расследований фактов нарушений обработки ПД
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Положение о режиме коммерческой тайны в ООО _Газпром трансгаз Ухта_ к приказу 2024
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Положение об обработке ПД в ГТУ 1021 от 30_10_24
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Правила парольной защиты
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Приказ от 27_12_2023 №1218 Перечень КТ_КИ
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Р 46-027-2024 Эл почта
            </Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/ib/letter" style={{ textDecoration: "none", color: "blue" }}>
            Р 46-034-2024 инструкция пользователя по обеспечению ИБ
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
});

export default Ib;
