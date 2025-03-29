'use client';

import { useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Alert, Spinner } from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';

const PageArtinama = () => {
  const [nama, setNama] = useState('');
  const [artiNama, setArtiNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch(`/api/other/artinama?nama=${nama}`);
      const data = await res.json();

      if (data.success && data.result.status) {
        setArtiNama(data.result.message.arti);
        setCatatan(data.result.message.catatan || '');
      } else {
        setError('Nama tidak ditemukan atau terjadi kesalahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan dalam mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(artiNama).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0 p-4">
        <h1 className="text-center mb-4">Cek Arti Nama</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNama">
            <Form.Label>Masukkan Nama</Form.Label>
            <Form.Control
              type="text"
              placeholder="Contoh: aldi"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
            {loading ? <><Spinner animation="border" size="sm" /> Memuat...</> : 'Cari Arti'}
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {artiNama && !loading && (
          <div className="mt-4 text-center">
            <h5>Arti Nama:</h5>
            <p className="text-muted">{artiNama}</p>

            {catatan && (
              <p className="text-muted"><strong>Catatan:</strong> {catatan}</p>
            )}

            <Button variant="outline-secondary" onClick={handleCopy} className="mt-2 d-flex align-items-center mx-auto">
              <Clipboard size={20} className="mr-2" />
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default PageArtinama;
