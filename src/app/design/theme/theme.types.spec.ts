import { ThemeMode, FontSize } from './theme.types';

describe('Theme Types', () => {
  describe('ThemeMode', () => {
    it('should have light theme mode', () => {
      const lightMode: ThemeMode = 'light';
      expect(lightMode).toBe('light');
    });

    it('should have dark theme mode', () => {
      const darkMode: ThemeMode = 'dark';
      expect(darkMode).toBe('dark');
    });

    it('should accept valid theme mode values', () => {
      const validModes: ThemeMode[] = ['light', 'dark'];
      validModes.forEach(mode => {
        expect(['light', 'dark']).toContain(mode);
      });
    });
  });

  describe('FontSize', () => {
    it('should have sm font size', () => {
      const smSize: FontSize = 'sm';
      expect(smSize).toBe('sm');
    });

    it('should have md font size', () => {
      const mdSize: FontSize = 'md';
      expect(mdSize).toBe('md');
    });

    it('should have lg font size', () => {
      const lgSize: FontSize = 'lg';
      expect(lgSize).toBe('lg');
    });

    it('should have xl font size', () => {
      const xlSize: FontSize = 'xl';
      expect(xlSize).toBe('xl');
    });

    it('should accept valid font size values', () => {
      const validSizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
      validSizes.forEach(size => {
        expect(['sm', 'md', 'lg', 'xl']).toContain(size);
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce ThemeMode type constraints', () => {
      const testThemeMode = (mode: ThemeMode): string => {
        return `Theme is ${mode}`;
      };

      expect(testThemeMode('light')).toBe('Theme is light');
      expect(testThemeMode('dark')).toBe('Theme is dark');
    });

    it('should enforce FontSize type constraints', () => {
      const testFontSize = (size: FontSize): string => {
        return `Font size is ${size}`;
      };

      expect(testFontSize('sm')).toBe('Font size is sm');
      expect(testFontSize('md')).toBe('Font size is md');
      expect(testFontSize('lg')).toBe('Font size is lg');
      expect(testFontSize('xl')).toBe('Font size is xl');
    });
  });
});