import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { getRooms, createRoom, updateRoom, deleteRoom, getLocations, uploadRoomImage } from "@/services/api";
import { Room, Location } from "@/types";
import { toast } from "sonner";

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    tenPhong: "",
    khach: 0,
    phongNgu: 0,
    giuong: 0,
    phongTam: 0,
    moTa: "",
    giaTien: 0,
    maViTri: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, locRes] = await Promise.all([getRooms(), getLocations()]);
      setRooms(roomRes.content);
      setLocations(locRes.content);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let roomId: number;
      if (editingRoom) {
        const res = await updateRoom(editingRoom.id, formData);
        roomId = editingRoom.id;
        toast.success("Cập nhật thành công");
      } else {
        const res = await createRoom(formData);
        roomId = (res.content as any).id;
        toast.success("Thêm phòng thành công");
      }

      // Nếu có chọn file ảnh, tiến hành upload
      if (selectedFile && roomId) {
        await uploadRoomImage(roomId, selectedFile);
        toast.success("Đã tải lên hình ảnh");
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý phòng thuê</h2>
        <Button onClick={() => { setEditingRoom(null); setIsDialogOpen(true); }} className="bg-rose-500 hover:bg-rose-600">
          <Plus className="mr-2 h-4 w-4" /> Thêm phòng mới
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Giá tiền</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <img src={room.hinhAnh} alt="" className="w-16 h-12 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{room.tenPhong}</TableCell>
                <TableCell>{room.giaTien}$</TableCell>
                <TableCell>{room.khach} khách</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => {
                    setEditingRoom(room);
                    setFormData(room as any);
                    setIsDialogOpen(true);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={async () => {
                    if(confirm("Xóa phòng này?")) {
                      await deleteRoom(room.id);
                      fetchData();
                    }
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Chỉnh sửa phòng" : "Đăng phòng mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Tên phòng</Label>
              <Input value={formData.tenPhong} onChange={e => setFormData({...formData, tenPhong: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <Label>Vị trí</Label>
              <Select value={formData.maViTri.toString()} onValueChange={val => setFormData({...formData, maViTri: Number(val)})}>
                <SelectTrigger><SelectValue placeholder="Chọn vị trí" /></SelectTrigger>
                <SelectContent>
                  {locations.map(loc => <SelectItem key={loc.id} value={loc.id.toString()}>{loc.tenViTri}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Giá tiền ($/đêm)</Label>
              <Input type="number" value={formData.giaTien} onChange={e => setFormData({...formData, giaTien: Number(e.target.value)})} />
            </div>

            <div className="grid grid-cols-4 col-span-2 gap-4">
              <div className="space-y-1"><Label>Khách</Label><Input type="number" value={formData.khach} onChange={e => setFormData({...formData, khach: Number(e.target.value)})}/></div>
              <div className="space-y-1"><Label>P. Ngủ</Label><Input type="number" value={formData.phongNgu} onChange={e => setFormData({...formData, phongNgu: Number(e.target.value)})}/></div>
              <div className="space-y-1"><Label>Giường</Label><Input type="number" value={formData.giuong} onChange={e => setFormData({...formData, giuong: Number(e.target.value)})}/></div>
              <div className="space-y-1"><Label>P. Tắm</Label><Input type="number" value={formData.phongTam} onChange={e => setFormData({...formData, phongTam: Number(e.target.value)})}/></div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Mô tả</Label>
              <Textarea value={formData.moTa} onChange={e => setFormData({...formData, moTa: e.target.value})} />
            </div>

            {/* Tiện ích - Dùng Switch */}
            <div className="col-span-2 grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
              {['wifi', 'mayGiat', 'dieuHoa', 'tivi', 'bep', 'doXe', 'hoBoi', 'banLa'].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Switch checked={(formData as any)[item]} onCheckedChange={(val) => setFormData({...formData, [item]: val})} />
                  <Label className="capitalize">{item}</Label>
                </div>
              ))}
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Hình ảnh phòng</Label>
              <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            </div>

            <DialogFooter className="col-span-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-rose-500">Lưu thông tin</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagement;