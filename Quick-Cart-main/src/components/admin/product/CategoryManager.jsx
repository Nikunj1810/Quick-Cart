import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CategoryManager = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await onAddCategory(newCategoryName);
      setNewCategoryName("");
      toast({
        title: "Category added",
        description: "The category has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryId || !editCategoryName.trim()) return;
    
    try {
      await onUpdateCategory(editCategoryId, editCategoryName);
      setEditCategoryId(null);
      setEditCategoryName("");
      toast({
        title: "Category updated",
        description: "The category has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await onDeleteCategory(id);
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the category",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Category Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
          />
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
              {editCategoryId === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleUpdateCategory}>Save</Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditCategoryId(null);
                      setEditCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;