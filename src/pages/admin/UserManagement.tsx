import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Search, Plus, Loader2 } from "lucide-react";
import { getUsers, deleteUser, createUser, updateUser } from "@/services/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  avatar?: string;
  gender?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "true",
    role: "USER",
    password: ""
  });

  // Tìm hàm fetchUsers cũ và thay thế bằng hàm này:
const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await getUsers(1, 100, searchTerm);
    
    // LOGIC QUAN TRỌNG:
    // API phân trang trả về object { data: [], ... } nằm trong content
    // Chúng ta cần lấy res.content.data
    if (res.content && (res.content as any).data) {
      setUsers((res.content as any).data);
    } 
    // Dự phòng trường hợp API thay đổi trả về mảng trực tiếp
    else if (Array.isArray(res.content)) {
      setUsers(res.content);
    }
    else {
      setUsers([]);
    }
  } catch (error) {
    console.error(error);
    toast.error("Không tải được danh sách người dùng");
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      birthday: "",
      gender: "true",
      role: "USER",
      password: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday || "", 
      gender: user.gender ? "true" : "false",
      role: user.role,
      password: "" 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      toast.success("Xóa thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        gender: formData.gender === "true",
        birthday: formData.birthday
      };
      if (editingUser) {
        if (!payload.password) delete (payload as any).password;
        await updateUser(editingUser.id, payload);
        toast.success("Cập nhật thành công!");
      } else {
        await createUser(payload);
        toast.success("Thêm mới thành công!");
      }
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & BUTTON */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800">Quản lý người dùng</h2>
          <p className="text-muted-foreground text-sm">Quản lý danh sách thành viên hệ thống</p>
        </div>
        <Button onClick={handleAddNew} className="bg-rose-600 hover:bg-rose-700 shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Thêm người dùng mới
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
        
        {/* SEARCH BAR */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên..."
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE - ĐÃ CỐ ĐỊNH WIDTH */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                {/* 1. Avatar - Cố định 80px */}
                <TableHead className="w-[80px]">Avatar</TableHead>
                
                {/* 2. Họ tên - Tự do */}
                <TableHead className="min-w-[150px]">Họ tên</TableHead>
                
                {/* 3. Email - Tự do hoặc tối thiểu */}
                <TableHead className="min-w-[200px]">Email</TableHead>
                
                {/* 4. SĐT - Cố định 120px */}
                <TableHead className="w-[120px]">SĐT</TableHead>

                {/* 5. Ngày sinh - Cố định 120px */}
                <TableHead className="w-[120px]">Ngày sinh</TableHead>
                
                {/* 6. Vai trò - Cố định 100px */}
                <TableHead className="w-[100px]">Vai trò</TableHead>
                
                {/* 7. Hành động - Cố định 100px, căn phải */}
                <TableHead className="w-[100px] text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" /> Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* 1. Avatar */}
                    <TableCell>
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-rose-100 text-rose-600 font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* 2. Họ tên */}
                    <TableCell className="font-medium text-gray-900 truncate max-w-[200px]" title={user.name}>
                        {user.name}
                    </TableCell>
                    
                    {/* 3. Email */}
                    <TableCell className="text-gray-600 truncate max-w-[250px]" title={user.email}>
                        {user.email}
                    </TableCell>
                    
                    {/* 4. SĐT */}
                    <TableCell className="text-gray-600 font-mono text-sm">
                        {user.phone || '---'}
                    </TableCell>

                    {/* 5. Ngày sinh */}
                    <TableCell className="text-gray-600 text-sm">
                        {formatDateDisplay(user.birthday)}
                    </TableCell>

                    {/* 6. Vai trò */}
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} 
                             className={user.role === 'ADMIN' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}>
                        {user.role || 'USER'}
                      </Badge>
                    </TableCell>

                    {/* 7. Hành động */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* DIALOG FORM */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Cập nhật thông tin" : "Thêm người dùng mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
             {/* ... (Phần Form giữ nguyên như cũ vì không ảnh hưởng hiển thị bảng) */}
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
                disabled={!!editingUser}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input 
                  id="birthday" 
                  type="date"
                  value={formData.birthday ? formData.birthday.split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(val) => setFormData({...formData, gender: val})}
                >
                  <SelectTrigger>
                     <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Nam</SelectItem>
                    <SelectItem value="false">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Người dùng (User)</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingUser ? "Lưu thay đổi" : "Tạo người dùng"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;