import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string; // YYYY-MM-DD format
  onDateChange: (date: string) => void; // Returns YYYY-MM-DD format
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePicker({
  label,
  placeholder = "Select date",
  value,
  onDateChange,
  error,
  leftIcon,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const dateParts = value.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          setSelectedYear(year);
          setSelectedMonth(month);
          setSelectedDay(day);
        }
      }
    }
  }, [value]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const formatDate = (year: number, month: number, day: number) => {
    const monthStr = month.toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handleConfirm = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const validDay = Math.min(selectedDay, daysInMonth);
    const dateString = formatDate(selectedYear, selectedMonth, validDay);
    onDateChange(dateString);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  // Generate years (last 100 years to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  // Adjust day if it exceeds days in month
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedYear, selectedMonth]);

  const displayValue = value
    ? (() => {
        const dateParts = value.split("-");
        if (dateParts.length === 3) {
          const date = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        return value;
      })()
    : placeholder;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          setIsOpen(true);
          setIsFocused(true);
        }}
        style={[
          styles.pickerContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <Text
          style={[
            styles.pickerText,
            {
              color: value ? theme.colors.text : theme.colors.textSecondary,
              flex: 1,
            },
          ]}
        >
          {displayValue}
        </Text>
        {/* <Ionicons
          name="calendar-outline"
          size={20}
          color={theme.colors.textSecondary}
        /> */}
      </TouchableOpacity>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text
                  style={[
                    styles.cancelButton,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {label || "Select Date"}
              </Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text
                  style={[
                    styles.confirmButton,
                    { color: theme.colors.primary },
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerRow}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text
                  style={[
                    styles.pickerLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Month
                </Text>
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => {
                    const monthName = new Date(
                      2000,
                      month - 1,
                      1
                    ).toLocaleDateString("en-US", {
                      month: "short",
                    });
                    const isSelected = selectedMonth === month;
                    return (
                      <TouchableOpacity
                        key={month}
                        onPress={() => setSelectedMonth(month)}
                        style={[
                          styles.pickerItem,
                          isSelected && {
                            backgroundColor: `${theme.colors.primary}15`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            {
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontWeight: isSelected ? "600" : "400",
                            },
                          ]}
                        >
                          {monthName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text
                  style={[
                    styles.pickerLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Day
                </Text>
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                >
                  {days.map((day) => {
                    const isSelected = selectedDay === day;
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => setSelectedDay(day)}
                        style={[
                          styles.pickerItem,
                          isSelected && {
                            backgroundColor: `${theme.colors.primary}15`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            {
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontWeight: isSelected ? "600" : "400",
                            },
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text
                  style={[
                    styles.pickerLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Year
                </Text>
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {years.map((year) => {
                    const isSelected = selectedYear === year;
                    return (
                      <TouchableOpacity
                        key={year}
                        onPress={() => setSelectedYear(year)}
                        style={[
                          styles.pickerItem,
                          isSelected && {
                            backgroundColor: `${theme.colors.primary}15`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            {
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontWeight: isSelected ? "600" : "400",
                            },
                          ]}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  pickerText: {
    fontSize: 16,
  },
  leftIcon: {
    marginRight: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    fontSize: 16,
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickerRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 300,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  scrollPicker: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 100,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 16,
  },
});
