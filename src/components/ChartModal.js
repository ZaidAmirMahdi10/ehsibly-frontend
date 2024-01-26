// ChartModal.js
import React, { useState } from 'react';

import { Modal, Button } from '@material-ui/core';
import ChartComponent from './ChartComponent';

const ChartModal = ({ open, onClose, data }) => {
  const [chartType, setChartType] = useState('bar');

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'bar' ? 'doughnut' : 'bar'));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="chart-modal">
        {/* New button to toggle chart type */}
        <Button variant="contained" color="secondary" style={{marginBottom: '15px'}} onClick={toggleChartType}>
          Toggle Chart Type
        </Button>

        {/* Your existing chart component with chartType prop */}
        <ChartComponent data={data} chartType={chartType} />

        {/* Close button */}
        <Button variant="contained" color="secondary" onClick={onClose}>
          Close Chart
        </Button>
      </div>
    </Modal>
  );
};

export default ChartModal;