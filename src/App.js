import React, { useState } from 'react';
import { Download, Plus, X, Play, Calendar, Users, BookOpen, MapPin, Settings, Clock } from 'lucide-react';

const TimetableConfigApp = () => {
  const [config, setConfig] = useState({
    timetableSettings: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      periodsPerDay: 8,
      minutesPerPeriod: 60,
      lunchBreakSlot: 3,
      lunchDuration: 60
    },
    penaltyWeights: {
      useLastPeriodPenalty: 20,
      teacherDislikePeriodPenalty: 10,
      groupFirstLastPeriodPenalty: 1
    },
    teachers: [
      {
        id: 'SJS',
        name: 'Prof. SJS',
        subjects: ['SC'],
        dislikePeriods: [1, 8],
        maxPerDay: 6,
        maxPerWeek: 30
      }
    ],
    groups: [
      {
        id: 'CSE_1A',
        size: 60,
        courses: ['SC', 'OS', 'DBMS']
      }
    ],
    courses: [
      {
        id: 'SC',
        requiredPerWeek: 2,
        roomType: 'lecture',
        eligibleTeachers: ['SJS'],
        groups: ['CSE_1A'],
        duration: 1
      }
    ],
    rooms: [
      {
        id: 'R101',
        type: 'lecture',
        capacity: 60
      }
    ]
  });

  const [timetableResult, setTimetableResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  const generateTimetable = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = {
        groups: {
          'CSE_1A': {
            Mon: { 1: 'SC (SJS) [R101]', 2: '-', 3: '-', 4: '-', 5: '-', 6: '-', 7: '-', 8: '-' },
            Tue: { 1: '-', 2: 'SC (SJS) [R101]', 3: '-', 4: '-', 5: '-', 6: '-', 7: '-', 8: '-' },
            Wed: { 1: '-', 2: '-', 3: '-', 4: '-', 5: '-', 6: '-', 7: '-', 8: '-' },
            Thu: { 1: '-', 2: '-', 3: '-', 4: '-', 5: '-', 6: '-', 7: '-', 8: '-' },
            Fri: { 1: '-', 2: '-', 3: '-', 4: '-', 5: '-', 6: '-', 7: '-', 8: '-' }
          }
        },
        teacherLoad: {
          'SJS': { Mon: 1, Tue: 1, Wed: 0, Thu: 0, Fri: 0, Total: 2 }
        }
      };
      
      setTimetableResult(result);
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addItem = (category, newItem) => {
    setConfig(prev => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));
  };

  const removeItem = (category, index) => {
    setConfig(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (category, index, updatedItem) => {
    setConfig(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock size={24} />
                University Timetable Configuration System
              </h1>
              <p className="text-gray-600 mt-1">Configure your timetable settings and generate optimized schedules</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={generateTimetable}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={16} />
                {isGenerating ? 'Generating...' : 'Generate Timetable'}
              </button>
              
              <button
                onClick={downloadConfig}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={16} />
                Download Config
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton 
            id="settings" 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="teachers" 
            icon={Users} 
            label="Teachers" 
            active={activeTab === 'teachers'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="groups" 
            icon={Users} 
            label="Groups" 
            active={activeTab === 'groups'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="courses" 
            icon={BookOpen} 
            label="Courses" 
            active={activeTab === 'courses'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="rooms" 
            icon={MapPin} 
            label="Rooms" 
            active={activeTab === 'rooms'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="results" 
            icon={Calendar} 
            label="Results" 
            active={activeTab === 'results'}
            onClick={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings size={20} />
                    Timetable Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                      <input
                        type="text"
                        value={config.timetableSettings.days.join(', ')}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          timetableSettings: {
                            ...prev.timetableSettings,
                            days: e.target.value.split(', ').map(d => d.trim())
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Periods per Day</label>
                      <input
                        type="number"
                        value={config.timetableSettings.periodsPerDay}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          timetableSettings: {
                            ...prev.timetableSettings,
                            periodsPerDay: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minutes per Period</label>
                      <input
                        type="number"
                        value={config.timetableSettings.minutesPerPeriod}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          timetableSettings: {
                            ...prev.timetableSettings,
                            minutesPerPeriod: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lunch Break After Period</label>
                      <input
                        type="number"
                        value={config.timetableSettings.lunchBreakSlot}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          timetableSettings: {
                            ...prev.timetableSettings,
                            lunchBreakSlot: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-semibold mt-6">Penalty Weights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Use Last Period Penalty</label>
                      <input
                        type="number"
                        value={config.penaltyWeights.useLastPeriodPenalty}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          penaltyWeights: {
                            ...prev.penaltyWeights,
                            useLastPeriodPenalty: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Dislike Period Penalty</label>
                      <input
                        type="number"
                        value={config.penaltyWeights.teacherDislikePeriodPenalty}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          penaltyWeights: {
                            ...prev.penaltyWeights,
                            teacherDislikePeriodPenalty: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group First/Last Period Penalty</label>
                      <input
                        type="number"
                        value={config.penaltyWeights.groupFirstLastPeriodPenalty}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          penaltyWeights: {
                            ...prev.penaltyWeights,
                            groupFirstLastPeriodPenalty: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Teachers Tab */}
              {activeTab === 'teachers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users size={20} />
                      Teachers
                    </h3>
                    <button
                      onClick={() => addItem('teachers', {
                        id: `T${config.teachers.length + 1}`,
                        name: '',
                        subjects: [],
                        dislikePeriods: [],
                        maxPerDay: 6,
                        maxPerWeek: 30
                      })}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Teacher
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {config.teachers.map((teacher, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Teacher {index + 1}</h4>
                          <button
                            onClick={() => removeItem('teachers', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                              type="text"
                              value={teacher.id}
                              onChange={(e) => updateItem('teachers', index, { ...teacher, id: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={teacher.name}
                              onChange={(e) => updateItem('teachers', index, { ...teacher, name: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
                            <input
                              type="text"
                              value={teacher.subjects.join(', ')}
                              onChange={(e) => updateItem('teachers', index, { 
                                ...teacher, 
                                subjects: e.target.value.split(', ').map(s => s.trim()).filter(s => s)
                              })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dislike Periods</label>
                            <input
                              type="text"
                              value={teacher.dislikePeriods.join(', ')}
                              onChange={(e) => updateItem('teachers', index, { 
                                ...teacher, 
                                dislikePeriods: e.target.value.split(', ').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
                              })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., 1, 8"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Per Day</label>
                            <input
                              type="number"
                              value={teacher.maxPerDay}
                              onChange={(e) => updateItem('teachers', index, { ...teacher, maxPerDay: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Per Week</label>
                            <input
                              type="number"
                              value={teacher.maxPerWeek}
                              onChange={(e) => updateItem('teachers', index, { ...teacher, maxPerWeek: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Groups Tab */}
              {activeTab === 'groups' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users size={20} />
                      Groups
                    </h3>
                    <button
                      onClick={() => addItem('groups', {
                        id: `GROUP_${config.groups.length + 1}`,
                        size: 60,
                        courses: []
                      })}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Group
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {config.groups.map((group, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Group {index + 1}</h4>
                          <button
                            onClick={() => removeItem('groups', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Group ID</label>
                            <input
                              type="text"
                              value={group.id}
                              onChange={(e) => updateItem('groups', index, { ...group, id: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                            <input
                              type="number"
                              value={group.size}
                              onChange={(e) => updateItem('groups', index, { ...group, size: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Courses (comma-separated)</label>
                            <input
                              type="text"
                              value={group.courses.join(', ')}
                              onChange={(e) => updateItem('groups', index, { 
                                ...group, 
                                courses: e.target.value.split(', ').map(c => c.trim()).filter(c => c)
                              })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., SC, OS, DBMS"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen size={20} />
                      Courses
                    </h3>
                    <button
                      onClick={() => addItem('courses', {
                        id: `COURSE_${config.courses.length + 1}`,
                        requiredPerWeek: 2,
                        roomType: 'lecture',
                        eligibleTeachers: [],
                        groups: [],
                        duration: 1
                      })}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Course
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {config.courses.map((course, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Course {index + 1}</h4>
                          <button
                            onClick={() => removeItem('courses', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                            <input
                              type="text"
                              value={course.id}
                              onChange={(e) => updateItem('courses', index, { ...course, id: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Required Per Week</label>
                            <input
                              type="number"
                              value={course.requiredPerWeek}
                              onChange={(e) => updateItem('courses', index, { ...course, requiredPerWeek: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                            <select
                              value={course.roomType}
                              onChange={(e) => updateItem('courses', index, { ...course, roomType: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="lecture">Lecture</option>
                              <option value="lab">Lab</option>
                              <option value="tutorial">Tutorial</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (periods)</label>
                            <input
                              type="number"
                              value={course.duration}
                              onChange={(e) => updateItem('courses', index, { ...course, duration: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Teachers (comma-separated)</label>
                            <input
                              type="text"
                              value={course.eligibleTeachers.join(', ')}
                              onChange={(e) => updateItem('courses', index, { 
                                ...course, 
                                eligibleTeachers: e.target.value.split(', ').map(t => t.trim()).filter(t => t)
                              })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., SJS, ABC"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Groups (comma-separated)</label>
                            <input
                              type="text"
                              value={course.groups.join(', ')}
                              onChange={(e) => updateItem('courses', index, { 
                                ...course, 
                                groups: e.target.value.split(', ').map(g => g.trim()).filter(g => g)
                              })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., CSE_1A, CSE_1B"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin size={20} />
                      Rooms
                    </h3>
                    <button
                      onClick={() => addItem('rooms', {
                        id: `R${config.rooms.length + 101}`,
                        type: 'lecture',
                        capacity: 60
                      })}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Room
                    </button>
                  </div>
                  
                  <div className="grid gap-4">
                    {config.rooms.map((room, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Room {index + 1}</h4>
                          <button
                            onClick={() => removeItem('rooms', index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                            <input
                              type="text"
                              value={room.id}
                              onChange={(e) => updateItem('rooms', index, { ...room, id: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={room.type}
                              onChange={(e) => updateItem('rooms', index, { ...room, type: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="lecture">Lecture</option>
                              <option value="lab">Lab</option>
                              <option value="tutorial">Tutorial</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                            <input
                              type="number"
                              value={room.capacity}
                              onChange={(e) => updateItem('rooms', index, { ...room, capacity: parseInt(e.target.value) })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Results Tab */}
              {activeTab === 'results' && (
                <div className="space-y-8">
                  {!timetableResult ? (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No timetable generated yet. Configure your settings and click "Generate Timetable".</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar size={20} />
                        Generated Timetables
                      </h3>
                      
                      {Object.entries(timetableResult.groups).map(([groupId, schedule]) => (
                        <div key={groupId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <h4 className="font-semibold">{groupId}</h4>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium text-gray-700">Day</th>
                                  {[1,2,3,4,5,6,7,8].map(period => (
                                    <th key={period} className="px-4 py-2 text-center font-medium text-gray-700">
                                      P{period}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {config.timetableSettings.days.map(day => (
                                  <tr key={day} className="border-t">
                                    <td className="px-4 py-3 font-medium bg-gray-50">{day}</td>
                                    {[1,2,3,4,5,6,7,8].map(period => (
                                      <td key={period} className="px-2 py-3 text-center text-sm">
                                        {period === 4 ? (
                                          <div className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded text-xs">
                                            LUNCH
                                          </div>
                                        ) : (
                                          <div className={schedule[day] && schedule[day][period] !== '-' ? 
                                            'bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs' : 
                                            'text-gray-400'
                                          }>
                                            {schedule[day] ? schedule[day][period] : '-'}
                                          </div>
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}

                      {/* Teacher Load Summary */}
                      {timetableResult.teacherLoad && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <h4 className="font-semibold">Teacher Load Summary</h4>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium text-gray-700">Teacher</th>
                                  {config.timetableSettings.days.map(day => (
                                    <th key={day} className="px-4 py-2 text-center font-medium text-gray-700">{day}</th>
                                  ))}
                                  <th className="px-4 py-2 text-center font-medium text-gray-700">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(timetableResult.teacherLoad).map(([teacher, load]) => (
                                  <tr key={teacher} className="border-t">
                                    <td className="px-4 py-3 font-medium bg-gray-50">{teacher}</td>
                                    {config.timetableSettings.days.map(day => (
                                      <td key={day} className="px-4 py-3 text-center">{load[day] || 0}</td>
                                    ))}
                                    <td className="px-4 py-3 text-center font-semibold">{load.Total}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Config Preview Sidebar */}
          {activeTab !== 'results' && (
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings size={16} />
                  Configuration Preview
                </h4>
                <pre className="text-xs text-gray-600 overflow-auto max-h-96 bg-white p-3 rounded border">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Generating Timetable</h3>
              <p className="text-gray-600">Running genetic algorithm optimization...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableConfigApp;